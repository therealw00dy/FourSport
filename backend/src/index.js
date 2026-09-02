// Load environment variable
require("dotenv").config();

// Connect to MongoDB
const connectDB = require("./db");
connectDB();

// Dependancy import
const express = require("express");
const app = express();
app.use(express.json());

// Import models
const Team = require("./models/Team");
const Matchup = require("./models/Matchup");

// Status check route
app.get("/api/health", (req, res) => {
    res.json({ status: "ok"});
});


///////////////////////////////
/////// Team Routing /////////
/////////////////////////////

// Team get
app.get("/api/teams", async (req, res) => {
    const teams = await Team.find();
    res.json(teams);
});

// Team post
app.post("/api/teams", async (req, res) => {
    const { name, PF, PA } = req.body;

    const team = await Team.create({ name, PF, PA });
    res.json(team);
});

// Team put
app.put("/api/teams/:id", async (req, res) => {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
});

// Team delete
app.delete("/api/teams/:id", async (req, res) => {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team deleted" });
});
///////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////
/////// Matchup Routing /////////
////////////////////////////////

// Generate matchups
app.post("/api/matchups/generate/:week", async (req, res) => {
    const week = parseInt(req.params.week);

    const teams = await Team.find();

    if (teams.length % 2 !== 0) {
        return res.status(400).json({ error: "Odd number of teams - cannot generate matchup"});
    }

    // Shuffle teams
    const shuffled = teams.sort(() => Math.random() - 0.5);

    const matchups = [];
    
    for (let i = 0; i < shuffled.length; i += 2) {
        const homeTeam = shuffled[i];
        const awayTeam = shuffled[i + 1];

        const matchup = await Matchup.create({
            week,
            homeTeam: homeTeam._id,
            awayTeam: awayTeam._id
        });

        matchups.push(matchup);
    }

    res.json(matchups);
});

// Get matchups
app.get("/api/matchups/:week", async (req, res) => {
    const week = parseInt(req.params.week);

    const matchups = await Matchup.find({ week })
        .populate("homeTeam")
        .populate("awayTeam");

    res.json(matchups);
});

// Delete matchups
app.delete("/api/matchups/week/:week", async (req, res) => {
    const week = parseInt(req.params.week);
    const result = await Matchup.deleteMany({ week });
    res.json({ message: "Matchups deleted", deleted: result.deletedCount });
});
////////////////////////////////////////////////////////////////////////////////////////////


// Start Server
app.listen(3000, () => console.log("Backend running on port 3000"));