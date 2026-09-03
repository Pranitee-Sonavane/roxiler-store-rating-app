const pool = require("../config/db");
const bcrypt = require("bcrypt");

const createUserByAdmin = async (req, res) => {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !address || !password || !role) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({
            message: "Name must be between 20 and 60 characters"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
        });
    }

    if (address.length > 400) {
        return res.status(400).json({
            message: "Address must not exceed 400 characters"
        });
    }

    const allowedRoles = ["admin", "user", "store_owner"];

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            message: "Invalid role"
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
            [name, email, hashedPassword, address, role]
        );

        return res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};

const createStore = async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address || !owner_id) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({
            message: "Store name must be between 20 and 60 characters"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }

    if (address.length > 400) {
        return res.status(400).json({
            message: "Address must not exceed 400 characters"
        });
    }

    try {
        // Check owner exists
        const owner = await pool.query(
            "SELECT id, role FROM users WHERE id = $1",
            [owner_id]
        );

        if (owner.rows.length === 0) {
            return res.status(404).json({
                message: "Store owner not found"
            });
        }

        if (owner.rows[0].role !== "store_owner") {
            return res.status(400).json({
                message: "Selected user is not a store owner"
            });
        }

        const existingStore = await pool.query(
            "SELECT id FROM stores WHERE email = $1",
            [email]
        );

        if (existingStore.rows.length > 0) {
            return res.status(409).json({
                message: "Store email already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO stores (name, email, address, owner_id)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, address, owner_id`,
            [name, email, address, owner_id]
        );

        return res.status(201).json({
            message: "Store created successfully",
            store: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};


const getDashboardStats = async (req, res) => {
    try {
        const users = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        const stores = await pool.query(
            "SELECT COUNT(*) FROM stores"
        );

        const ratings = await pool.query(
            "SELECT COUNT(*) FROM ratings"
        );

        return res.status(200).json({
            totalUsers: Number(users.rows[0].count),
            totalStores: Number(stores.rows[0].count),
            totalRatings: Number(ratings.rows[0].count)
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};


const getAllStores = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS rating
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
            GROUP BY s.id
            ORDER BY s.name ASC
        `);

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};


const getAllUsers = async (req, res) => {
    const { name, email, address, role, sortBy = "name", order = "asc" } = req.query;

    const allowedSortFields = {
        name: "name",
        email: "email",
        address: "address",
        role: "role"
    };

    const sortField = allowedSortFields[sortBy] || "name";
    const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

    try {
        let query = `
            SELECT id, name, email, address, role
            FROM users
            WHERE 1=1
        `;

        const values = [];
        let index = 1;

        if (name) {
            query += ` AND name ILIKE $${index++}`;
            values.push(`%${name}%`);
        }

        if (email) {
            query += ` AND email ILIKE $${index++}`;
            values.push(`%${email}%`);
        }

        if (address) {
            query += ` AND address ILIKE $${index++}`;
            values.push(`%${address}%`);
        }

        if (role) {
            query += ` AND role = $${index++}`;
            values.push(role);
        }

        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const result = await pool.query(query, values);

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};


const getUserDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT
                u.id,
                u.name,
                u.email,
                u.address,
                u.role,
                s.id AS store_id,
                s.name AS store_name,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS store_rating
             FROM users u
             LEFT JOIN stores s
                ON s.owner_id = u.id
             LEFT JOIN ratings r
                ON r.store_id = s.id
             WHERE u.id = $1
             GROUP BY u.id, s.id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};



module.exports = {
    createUserByAdmin,
    createStore,
    getDashboardStats,
    getAllStores,
    getAllUsers,
    getUserDetails
};