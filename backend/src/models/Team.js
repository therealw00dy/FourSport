const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true},
    owner: { type: String }, // Swap to user ref later after adding auth
});

TeamSchema.virtual("roster", {
    ref: "Player",
    localField: "_id",
    foreignField: "fantasyTeam",
}),

TeamSchema.set("toJSON", { virtuals: true });
TeamSchema.set("toObject", { virtuals: true });


module.exports = mongoose.model("Team", TeamSchema);