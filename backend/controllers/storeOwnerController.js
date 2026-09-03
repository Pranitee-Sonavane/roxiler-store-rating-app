const pool = require("../config/db");

const getOwnerDashboard = async (req, res) => {
    try {
        const storeResult = await pool.query(
            `SELECT id, name
             FROM stores
             WHERE owner_id = $1`,
            [req.user.id]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                message: "No store assigned to this owner"
            });
        }

        const store = storeResult.rows[0];

        const ratingsResult = await pool.query(
            `SELECT
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                r.rating
             FROM ratings r
             JOIN users u
                ON r.user_id = u.id
             WHERE r.store_id = $1
             ORDER BY u.name ASC`,
            [store.id]
        );

        const averageResult = await pool.query(
            `SELECT
                COALESCE(ROUND(AVG(rating), 2), 0) AS average_rating,
                COUNT(*) AS total_ratings
             FROM ratings
             WHERE store_id = $1`,
            [store.id]
        );

        return res.status(200).json({
            store,
            averageRating: Number(averageResult.rows[0].average_rating),
            totalRatings: Number(averageResult.rows[0].total_ratings),
            ratings: ratingsResult.rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};

module.exports = {
    getOwnerDashboard
};