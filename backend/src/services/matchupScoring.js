// Brings Player, PlayerScore, and lineupOptimizer together to give answer of week scores in N week

const Player = require("../models/Player");
const PlayerScore = require("../models/PlayerScore");
const { getOptimalLineup } = require("./lineupOptimizer");

const SPORTS_LIST = ["NFL", "NBA", "MLB", "NHL"];

async function computeTeamWeekScore(teamId, week, season) {
    const breakdown = { NFL: 0, NBA: 0, MLB: 0, NHL: 0};

    for (const sport of SPORTS_LIST) {
        const players = await Player.find({ fantasyTeam: teamId, sport });

        if (players.length === 0) {
            continue;
        }

        const scores = await PlayerScore.find({
            player: { $in: players.map((p) => p._id) },
            week,
            season,
        });

        const scoreByPlayerId = new Map(
            scores.map((s) => [s.player.toString(), s.fantasyPoints])
        );

        const rosterWithPoints = players.map((p) => ({
            playerID: p._id.toString(),
            position: p.position,

            // Player with no recorded score gets 0, but still eligible to be put in a slot if necessary
            points: scoreByPlayerId.get(p._id.toString()) || 0,
        }));

        const { totalPoints } = getOptimalLineup(sport, rosterWithPoints);
        breakdown[sport] = totalPoints;
    }

    const total = SPORTS_LIST.reduce((sum, sport) => sum + breakdown[sport], 0);

    return { breakdown, total: Math.round(total * 100) / 100 }; 
}

module.exports = { computeTeamWeekScore };