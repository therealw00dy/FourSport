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

// Status check route
app.get("/api/health", (req, res) => {
    res.json({ status: "ok"});
});

// Team route
app.get("/api/teams", async (req, res) => {
    const teams = await Team.find();
    res.json(teams);
});

app.post("api/teams", async (req, res) => {
    const { name, PF, PA } = req.body;

    const team = await Team.create({ name, PF, PA });
    res.json(team);
});


// Start Server
app.listen(3000, () => console.log("Backend running on port 3000"));