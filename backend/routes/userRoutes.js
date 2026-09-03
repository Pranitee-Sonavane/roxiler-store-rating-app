const express = require("express");
const pool = require("../config/db");
const { registerUser, loginUser } = require("../controllers/userController");
const router = express.Router();
const authorizeRoles = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
    createUserByAdmin,
    createStore,
    getDashboardStats,
    getAllStores,
    getAllUsers,
    getUserDetails
} = require("../controllers/adminController");

const {
    getStores,
    submitRating
} = require("../controllers/storeController");

router.post(
    "/admin/users",
    authMiddleware,
    authorizeRoles("admin"),
    createUserByAdmin
);
router.get(
    "/stores",
    authMiddleware,
    authorizeRoles("user"),
    getStores
);

router.post(
    "/ratings",
    authMiddleware,
    authorizeRoles("user"),
    submitRating
);


router.get("/admin-test", authMiddleware, authorizeRoles("admin"), (req, res) => {
    res.json({
        message: "Welcome Admin!"
    });
});
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
router.post("/login", loginUser);

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});


router.post(
    "/admin/users",
    authMiddleware,
    authorizeRoles("admin"),
    createUserByAdmin
);

router.post(
    "/admin/stores",
    authMiddleware,
    authorizeRoles("admin"),
    createStore
);

router.get(
    "/admin/dashboard",
    authMiddleware,
    authorizeRoles("admin"),
    getDashboardStats
);

router.get(
    "/admin/stores",
    authMiddleware,
    authorizeRoles("admin"),
    getAllStores
);


router.get(
    "/admin/users/:id",
    authMiddleware,
    authorizeRoles("admin"),
    getUserDetails
);
module.exports = router;