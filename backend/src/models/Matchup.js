/*
const mongoose = require("mongoose");

const SportBreakdownSchema = new mongoose.Schema(
    {
        NFL: { type: Number, default: 0 },
        NBA: { type: Number, default: 0 },
        MLB: { type: Number, default: 0 },
        NHL: { type: Number, default: 0 },
    },
    { _id: false }
);

const MatchupSchema = new mongoose.Schema({
    week: { type: Number, required: true },
    season: { type: Number, required: true },

    homeTeam { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    
})

module.exports = mongoose.model("Matchup", MatchupSchema);