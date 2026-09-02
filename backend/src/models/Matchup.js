const mongoose = require("mongoose");

const MatchupSchema = new mongoose.Schema({
    week: Number,
    homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    homeScore: Number,
    awayScore: Number
});

module.exports = mongoose.model("Matchup", MatchupSchema);