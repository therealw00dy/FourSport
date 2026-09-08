// Wrapper around sportsConfig scoring formula

const { SCORING } = require("../config/sportsConfig");

function computeFantasyPoints(sport, rawStats) {
    const formula = SCORING[sport];

    if (!formula) {
        throw new Error('No scoring formula defined for sport: $[sport]');
    }

    const points = formula(rawStats || {});

    return Math.round(points * 100) / 100;
}

module.exports = {computeFantasyPoints};