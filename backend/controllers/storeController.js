const pool = require("../config/db");


const getStores = async (req, res) => {
    const { search } = req.query;

    try {
        let query = `
            SELECT
                s.id,
                s.name,
                s.address,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS overall_rating,
                COALESCE(
                    MAX(CASE WHEN r.user_id = $1 THEN r.rating END),
                    0
                ) AS user_rating
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
            WHERE 1=1
        `;

        const values = [req.user.id];

        if (search) {
            query += `
                AND (
                    s.name ILIKE $2
                    OR s.address ILIKE $2
                )
            `;
            values.push(`%${search}%`);
        }

        query += `
            GROUP BY s.id
            ORDER BY s.name ASC
        `;

        const result = await pool.query(query, values);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
};


const submitRating = async (req, res) => {
    const { store_id, rating } = req.body;

    if (!store_id || !rating) {
        return res.status(400).json({
            message: "Store ID and rating are required"
        });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
        return res.status(400).json({
            message: "Rating must be an integer between 1 and 5"
        });
    }

    try {
        const store = await pool.query(
            "SELECT id FROM stores WHERE id = $1",
            [store_id]
        );

        if (store.rows.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        const result = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, store_id)
             DO UPDATE SET rating = EXCLUDED.rating
             RETURNING id, user_id, store_id, rating`,
            [req.user.id, store_id, rating]
        );

        res.status(200).json({
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
};


module.exports = {
    getStores,
    submitRating
};