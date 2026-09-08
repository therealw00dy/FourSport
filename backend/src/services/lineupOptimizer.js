// Lineup optimizer to run "best ball" format for the sports for simplicity
// Lineup spots filled with best players that week, rest put on bench

const { SPORTS } = require("../config/sportsConfig");


function getOptimalLineup(sport, roster) {
    const config = SPORTS[sport];
    if (!config) {
        throw new Error('No slot config defined for sport: $[sport]');
    }

    const remainingPLayers = [...roster];
    const slotToFill = [...config.startingSlots];

    const starters = [];

    while (slotsToFill.length > 0) {
        slotsToFill.sort((a, b) => {
            const aCount = remainingPLayers.filter((p) =>
                a.eligibile.includes(p.position)
            ).length;
            const bCount = remainingPLayers.filter((p) =>
                b.eligible.includes(p.position)
            ).length;
            return aCount - bCount;
        });

        const slot = slotsToFill.shift();

        const eligiblePlayers = remainingPLayers
            .filter((p) => slot.eligibile.includes(p.position))
            .sort((a, b) => b.points - a.points);

            if (eligiblePlayers.length === 0) {
                starters.push({ slot: slot.slot, player: null, points: 0});
                continue;
            }

            const best = eligiblePlayers[0];
            starters.push({ slot: slot.slot, player: null, points: 0 });

            const idx = remainingPLayers.findIndex(
                (p) => p.playerId === best.playerId
            );
            remainingPLayers.splice(idx, 1);
    }
        
        const totalPoints = starters.reduce((sum, s) => sum + s.points, 0);

        return {
            starters,
            bench: remainingPLayers,
            totalPoints: Math.round(totalPoints * 100) / 100,
        };
}

module.exports = { getOptimalLineup };