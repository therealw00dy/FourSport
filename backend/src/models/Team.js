const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true},
    PF: { type: Number, default: 0},
    PA: { type: Number, default: 0 }
});

module.exports = mongoose.model("Team", TeamSchema);