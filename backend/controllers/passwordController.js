const pool = require("../config/db");
const bcrypt = require("bcrypt");

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            message: "Current password and new password are required"
        });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
            message:
                "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
        });
    }

    try {
        const result = await pool.query(
            "SELECT password FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isCurrentPasswordCorrect = await bcrypt.compare(
            currentPassword,
            result.rows[0].password
        );

        if (!isCurrentPasswordCorrect) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashedPassword, req.user.id]
        );

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};

module.exports = {
    updatePassword
};