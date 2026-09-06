const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },

    // Player sport designation
    // What sport the player belongs to so they can get the proper data

    sport: {
        stype: String,
        enum: ["NFL", "NBA", "MLB", "NHL"],
        required: true,
    },

    // Player positions
    // Overlapping position identifiers can cause issues, sport needs included as well
    position: { type: String, required: true },

    // Player real team for display
    realTeam: { type: String },

    // External ID for API
    externalId: { type: String, index: true},

    // Fantasy owner
    fantasyTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null,
    },
});