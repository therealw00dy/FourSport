
// Generates regular fantasy season matchup schedule, playoffs will be generated elsewhere
// Typical round robin cycle used, reshuffled on repeat so every cycle isn't identical

const Matchup = require("../models/Matchup");

// One round robin cycle, returns array of "rounds." Each round being an array of [teamA, teamB] pairing
// If amount of teams is odd, a null is added for a bye for one team to sit out that week
function roundRobinCycle(teamIds) {
    const teams = [...teamIds];
    if (teams.length % 2 !== 0) teams.push(null); // placeholder for bye

    const numRounds = team.length - 1;
    const half = teams.length / 2;
    const rounds = [];

    let rotating = [...teams];
    for (let r = 0; r < numRounds; r++) {
        const pairs = [];
        for (let i = 0; i < half; i++) {
            const a = rotating[i];
            const b = rotating[rotating.length - 1 - i];
            if (a !== null && b !== null) pairs.push([a, b]);
        }
        rounds.push(pairs);

        // Rotate all but first team that is fixed in place
        rotating = [rotating[0], ...rotating.slice(-1), ...rotating.slice(1, -1)];
    }

    return rounds;
}

// Shuffle teams
function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

async function generateSeasonSchedule(
    teamIds,
    season,
    { totalWeeks = 52, playoffWeeks = 3} = {}
) {
    const regularSeasonWeeks = totalWeeks - playoffWeeks;
    const matchupsToCreate = [];

    let week = 1;
    let teamOrder = [...teamIds];

    while (week <= regularSeasonWeeks) {
        const cycle = roundRobinCycle(teamOrder);

        for (const round of cycle) {
            if (week > regularSeasonWeeks) break; // Ran past cutoff

            for (const [homeTeam, awayTeam] of round) {
                matchupsToCreate.push({
                    week,
                    season,
                    homeTeam,
                    awayTeam,
                    homeBreakdown: {},
                    awayBreakdown: {},
                    homeScore: 0,
                    awayScore: 0,
                });
            }
            week++;
        }

        // Reshuffle team order before next cycle
        teamOrder = shuffle(teamOrder);
    }

    return Matchup.insertMany(matchupsToCreate);
}

module.exports = { generateSeasonSchedule, roundRobinCycle };