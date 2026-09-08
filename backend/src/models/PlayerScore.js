const mongoose = require("mongoose");

const PlayerScoreSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
    },

    sport: {
        type: String,
        enum: ["NFL", "NBA", "MLB", "NHL"],
        required: true,
    },

    week: { type: Number, required: true },
    season: { type: Number, required: true },

    // Raw stat line from API
    rawStats: { type: mongoose.Schema.Types.Mixed, defualt: {} },

    // Computed in services/scoring.js on ingest and store
    fantasyPoints: { type: mongoose.Schema.Types.Mixed, default: {} },
});

// Player should only have one score per week/season
PlayerScoreSchema.index(
    { player: 1, week: 1, season: 1},
    { unique: true }
);

module.exports = mongoose.model("PlayerScore", PlayerScoreSchema);