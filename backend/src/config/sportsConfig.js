// Team roster creation

const SPORTS = {
    NFL: {
        bench: 10,
        startingSlots: [
            { slot: "QB", eligible: ["QB"] },
            { slot: "RB", eligible: ["RB"] },
            { slot: "RB", eligible: ["RB"] },
            { slot: "WR", eligible: ["WR"] },
            { slot: "WR", eligible: ["WR"] },
            { slot: "TE", eligible: ["TE"] },
            { slot: "FLEX", eligible: ["FLEX"] },
            { slot: "SUPERFLEX", eligible: ["SUPERFLEX"] },
            { slot: "K", eligible: ["K"] },
            { slot: "DST", eligible: ["DST"] },
        ],
    },

    NBA: {
        bench: 6,
        startingSlots: [
            { slot: "PG", eligible: ["PG"] },
            { slot: "SG", eligible: ["SG"] },
            { slot: "G", eligible: ["PG", "SG"] },
            { slot: "SF", eligible: ["SF"] },
            { slot: "PF", eligible: ["PF"] },
            { slot: "F", eligible: ["SF", "PF"] },
            { slot: "C", eligible: ["C"] },
            { slot: "C", eligible: ["C"] },
            { slot: "U", eligible: ["SG", "PG", "SF", "PF"] },
        ],
    },

    MLB: {
        bench: 8,
        startingSlots: [
            { slot: "C", eligible: ["C"] },
            { slot: "1B", eligible: ["1B"] },
            { slot: "2B", eligible: ["2B"] },
            { slot: "3B", eligible: ["3B"] },
            { slot: "IN", eligible: ["1B", "2B", "3B", "SS"] },
            { slot: "LF", eligible: ["LF"] },
            { slot: "RF", eligible: ["RF"] },
            { slot: "CF", eligible: ["CF"] },
            { slot: "OF", eligible: ["LF", "CF", "RF", "OF"] },
            { slot: "U", eligible: ["C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "OF"] },
            { slot: "SP", eligible: ["SP"] },
            { slot: "SP", eligible: ["SP"] },
            { slot: "SP", eligible: ["SP"] },
            { slot: "SP", eligible: ["SP"] },
            { slot: "RP", eligible: ["RP"] },
            { slot: "RP", eligible: ["RP"] },
            { slot: "FP", eligible: ["SP", "RP"] },
        ],
    },

    NHL: {
        bench: 8,
        startingSlots: [
            { slot: "C", eligible: ["C"] },
            { slot: "C", eligible: ["C"] },
            { slot: "C", eligible: ["C"] },
            { slot: "LW", eligible: ["LW"] },
            { slot: "LW", eligible: ["LW"] },
            { slot: "LW", eligible: ["LW"] },
            { slot: "RW", eligible: ["RW"] },
            { slot: "RW", eligible: ["RW"] },
            { slot: "RW", eligible: ["RW"] },
            { slot: "D", eligible: ["D"] },
            { slot: "D", eligible: ["D"] },
            { slot: "D", eligible: ["D"] },
            { slot: "D", eligible: ["D"] },
            { slot: "FLX", eligible: ["C", "LW", "RW", "D"] },
            { slot: "G", eligible: ["G"] },
            { slot: "G", eligible: ["G"] },
        ],
    },
};


// Player scoring design
const SCORING = {

    NFL(stats = {}) {
        const s = stats;
        return (
            // Passing
            (s.passYards || 0) * 0.04 +
            (s.passTD || 0) * 4 +
            (s.interceptions || 0) * -2 +

            // Rushing
            (s.rushYards || 0) * 0.1 +
            (s.rushTD || 0) * 6 +

            // Receptions
            (s.receptions || 0) * 1 +
            (s.recYards || 0) * 0.1 +
            (s.recTD || 0) * 6 +

            // Misc
            (s.fumblesLost || 0) * -2 +
            (s.twoPtConversions || 0) * 2 +

            // Kicking
            (s.fgDeep || 0) * 6 +
            (s.fgLong || 0) * 5 +
            (s.fgMed || 0) * 4 +
            (s.fgShort || 0) * 3 +
            (s.fgMissed || 0) * -1 +
            (s.xpMade || 0) * 1 +
            (s.xpMissed || 0) * -1 +

            // DST
            (s.dstSack || 0) * 1 +
            (s.dstInt || 0) * 2 +
            (s.dstFumbleRec || 0) * 2 +
            (s.dstTD || 0) * 6 +
            (s.dstSafety || 0) * 2 +
            (s.dstBlock || 0) * 2 +
            (s.dstAllow_0 || 0) * 5 +
            (s.dstAllow_1_6 || 0) * 4 +
            (s.dstAllow_7_13 || 0) * 3 +
            (s.dstAllow_14_17 || 0) * 1 +
            (s.dstAllow_18_27 || 0) * 0 +
            (s.dstAllow_28_34 || 0) * -1 +
            (s.dstAllow_35_45 || 0) * -3 +
            (s.dstAllow_46 || 0) * -5 +
            (s.dst4thStop || 0) * 1
        );
    },

    NBA(stats = {}) {
        const s = stats;
        return (
            (s.points || 0) * 1 +
            (s.tpm || 0) * 1 +
            (s.fga || 0) * -1 +
            (s.fgm || 0) * 2 +
            (s.fta || 0) * -1 +
            (s.ftm || 0) * 1 +
            (s.reb || 0) * 1 +
            (s.ast || 0) * 2 +
            (s.stl || 0) * 4 +
            (s.blk || 0) * 4 +
            (s.tov || 0) * -2
        );
    },

    MLB(stats = {}) {
        const s = stats;
            // Batting
        const hitting =
            (s.runs || 0) * 1 +
            (s.tb || 0) * 1 +
            (s.rbi || 0) * 1 +
            (s.walks || 0) * 1 +
            (s.strikeouts || 0) * -1 +
            (s.stolen || 0) * 1;

            // Pitching
        const pitching =
            (s.innings || 0) * 3 +
            (s.hitsAllowed || 0) * -1 +
            (s.earnedRuns || 0) * -2 +
            (s.holds || 0) * 2 +
            (s.walksIssued || 0) * -1 +
            (s.strikeoutsThrown || 0) * 1 +
            (s.wins || 0) * 5 +
            (s.losses || 0) * -2 +
            (s.saves || 0) * 5;

        return hitting + pitching;
    
    },

    NHL(stats = {}) {
        const s = stats;
        return (
            (s.goals || 0) * 2 +
            (s.assists || 0) * 1 +
            (s.powerPlayPoints || 0) * 0.5 +
            (s.shortHandPoints || 0) * 0.5 +
            (s.shotOnGoal || 0) * 0.1 +
            (s.hits || 0) * 0.1 +
            (s.block || 0) * 0.5
        );
    },
};

module.exports = { SPORTS, SCORING };