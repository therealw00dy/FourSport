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
    res.json(team);
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

// GET matchups for week
app.get("/api/matchups/:week", async (req, res) => {
    const week = parseInt(req.params.week);

    const matchups = await Matchup.find({ week })
        .populate("homeTeam")
        .populate("awayTeam");

    res.json(matchups);
});

// DELETE matchups
app.delete("/api/matchups/week/:week", async (req, res) => {
    const week = parseInt(req.params.week);
    const result = await Matchup.deleteMany({ week });
    res.json({ message: "Matchups deleted", deleted: result.deletedCount });
});

app.put("/api/matchups/:id", async (req, res) => {
    try {
        const matchup = await Matchup.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate("homeTeam")
        .populate("awayTeam");

        if (!matchup) {
            return res.status(404).json({ error: "Matchup not found" });
        }

        res.json(matchup);
    } catch (err) {
        res.status(500).json({ error: "Server error"});
    }
});

// GET all matchups
app.get("/api/matchups", async (req, res) => {
    const matchups = await Matchup.find()
        .populate("homeTeam")
        .populate("awayTeam");

    res.json(matchups);
});
////////////////////////////////////////////////////////////////////////////////////////////

// GET standings
app.get("/api/standings", async (req, res) => {
    const teams = await Team.find();

    const matchups = await Matchup.find()
        .populate("homeTeam")
        .populate("awayTeam");

    const standings = {};

    teams.forEach(team => {
        standings[team._id] = {
            team: team.name,
            wins: 0,
            losses: 0,
            ties: 0,
            PF: 0,
            PA: 0
        };
    });

    
    matchups.forEach(matchup => {
        if (!matchup.homeTeam || !matchup.awayTeam) {
            return;
        }
        const homeTeamId = matchup.homeTeam._id;
        const awayTeamId = matchup.awayTeam._id;

        // Points for and against
        standings[homeTeamId].PF += matchup.homeScore || 0;
        standings[homeTeamId].PA += matchup.awayScore || 0;

        standings[awayTeamId].PF += matchup.awayScore || 0;
        standings[awayTeamId].PA += matchup.homeScore || 0;

        // Win / Loss
        if (matchup.homeScore > matchup.awayScore) {
            standings[homeTeamId].wins++;
            standings[awayTeamId].losses++;
        } else if (matchup.homeScore < matchup.awayScore) {
            standings[homeTeamId].losses++;
            standings[awayTeamId].wins++;        
        } else {
            standings[homeTeamId].ties++;
            standings[awayTeamId].ties++;
        }

    })
    

    const standingsArray = Object.values(standings);

    // Sort standings
    standingsArray.sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.PF - a.PF;
    });

    res.json(standingsArray);

});


// Start Server
app.listen(3000, () => console.log("Backend running on port 3000"));