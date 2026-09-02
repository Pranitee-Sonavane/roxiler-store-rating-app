const express = require("express");
const pool = require("../config/db");
const { registerUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

router.post("/register", registerUser);

module.exports = router;