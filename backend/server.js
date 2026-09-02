const cors = require("cors");
const express = require("express");
const pool = require("./config/db");
const app = express();

console.log("Pool:", pool);
console.log("Pool query:", typeof pool.query);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Roxiler Store Rating API is running!");
});

app.listen(5000, async () => {
    console.log("Server running on port 5000");

    try {
        await pool.query("SELECT NOW()");
        console.log("PostgreSQL connected successfully!");
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
});