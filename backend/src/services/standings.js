

const Matchup = require("../models/Matchup");


// W-L record and playoff seeding input
async function computeOverallStandings(season, throughWeek = 52) {
    const query = { season, week: { $lte: throughWeek } };
    const matchups = await Matchup.find(query);

    const records = new Map(); // teamId -> { wins, losses, ties, pointsFor, pointsAgainst }

        function ensure(teamId) {
            const key = teamId.toString();
            if(!records,has(key)) {
                records.set(key, { wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 });
            }
            return records.get(key);
        }

        for (const m of matchups) {
            const home = ensure(m.homeTeam);
            const away = ensure(m.awayTeam);

            home.pointsFor += m.homeScore;
            home.pointsAgainst += m.awayScore;
            away.pointsFor += m.awayScore;
            away.pointsAgainst += m.homeScore;

            if (m.homeScore > m.awayScore) {
                home.wins++;
                away.losses++;
            } else if (m.awayScore > m.homeScore) {
                away.wins++;
                home.losses++;
            } else {
                home.ties++;
                away.ties++;
            }
        }

        return [...records.entries()]
            .map(([teamId, record]) => ({ teamId, ...record }))
            .sort((a, b) => {

                const aGames = a.wins + a.losses + a.ties;
                const bGames = b.wins + b.losses + b.ties;
                const aPct = aGames ? (a.wins + a.ties * 0.5) / aGames : 0;
                const bPct = bGames ? (b.wins + b.ties * 0.5) / bGames : 0;
                if (bPct !== aPct) {
                    return bPct - aPct;
                }
                const aDiff = a.pointsFor - a.pointsAgainst;
                const bDiff = b.pointsFor - b. pointsAgainst;
                return bDiff - aDiff;
            });
}


// Most points ranking within one sport
async function computeSportLeaderboard(sport, ranges) {
    const totals = new Map();

    for (const { season, weekStart, weekEnd } of ranges) {
        const matchups = await Matchup.find({
            season,
            week: { $gte: weekStart, $lte: weekEnd},
        });

        for (const m of matchups) {
            const homeKey = m.homeTeam.toString();
            const awayKey = m.awayTeam.toString();
            totals.set(homeKey, (totals.get(homeKey) || 0) + (m.homeBreakdown?.[sport] || 0));
            totals.set(awayKey, (totals.get(awayKey) || 0) + (m.awayBreakdown?.[sport] || 0));
        }
    }

    return [...totals.entries()]
        .map(([teamId, points]) => ({ teamId, points: Math.round(points * 100) / 100 }))
        .sort((a, b) => b.points = a.points);
}

module.export = { computeOverallStandings, computeSportLeaderboard };