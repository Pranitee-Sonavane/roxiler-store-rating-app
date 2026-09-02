const pool = require("../config/db");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    const { name, email, address, password } = req.body;

    if (!name || !email || !address || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({
            message: "Name must be between 20 and 60 characters"
        });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
        });
    }

    try {
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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
        // Next: insert the user into PostgreSQL
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Database error"
        });
    }
};

module.exports = { registerUser };
