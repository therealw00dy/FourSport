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




// Start Server
app.listen(3000, () => console.log("Backend running on port 3000"));