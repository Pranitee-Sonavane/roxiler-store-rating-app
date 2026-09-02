const pool = require("../config/db");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    const { name, email, address, password } = req.body;

    // Required fields validation
    if (!name || !email || !address || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Name validation
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({
            message: "Name must be between 20 and 60 characters"
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
        });
    }

    // Address validation
    if (address.length > 400) {
        return res.status(400).json({
            message: "Address must not exceed 400 characters"
        });
    }

    try {
        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const result = await pool.query(
            `INSERT INTO users (name, email, password, address, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, address, role`,
            [name, email, hashedPassword, address, "user"]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};

module.exports = { registerUser };