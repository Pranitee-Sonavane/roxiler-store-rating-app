const express = require("express");
const pool = require("../config/db");

const {
    registerUser,
    loginUser
} = require("../controllers/userController");

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

const {
    updatePassword
} = require("../controllers/passwordController");

const {
    getOwnerDashboard
} = require("../controllers/storeOwnerController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================================
// PUBLIC ROUTES
// =====================================================

router.post("/register", registerUser);

router.post("/login", loginUser);


// =====================================================
// NORMAL USER ROUTES
// =====================================================

// Get all stores + search
router.get(
    "/stores",
    authMiddleware,
    authorizeRoles("user"),
    getStores
);

// Submit or modify rating
router.post(
    "/ratings",
    authMiddleware,
    authorizeRoles("user"),
    submitRating
);


// =====================================================
// COMMON AUTHENTICATED ROUTES
// =====================================================

// Update password
router.put(
    "/password",
    authMiddleware,
    updatePassword
);

// Check logged-in user
router.get(
    "/profile",
    authMiddleware,
    (req, res) => {
        res.json({
            message: "You are authenticated",
            user: req.user
        });
    }
);


// =====================================================
// STORE OWNER ROUTES
// =====================================================

router.get(
    "/owner/dashboard",
    authMiddleware,
    authorizeRoles("store_owner"),
    getOwnerDashboard
);


// =====================================================
// ADMIN ROUTES
// =====================================================

// Dashboard statistics
router.get(
    "/admin/dashboard",
    authMiddleware,
    authorizeRoles("admin"),
    getDashboardStats
);

// Add user
router.post(
    "/admin/users",
    authMiddleware,
    authorizeRoles("admin"),
    createUserByAdmin
);

// Get all users + filters + sorting
router.get(
    "/admin/users",
    authMiddleware,
    authorizeRoles("admin"),
    getAllUsers
);

// Get specific user details
router.get(
    "/admin/users/:id",
    authMiddleware,
    authorizeRoles("admin"),
    getUserDetails
);

// Add store
router.post(
    "/admin/stores",
    authMiddleware,
    authorizeRoles("admin"),
    createStore
);

// Get all stores
router.get(
    "/admin/stores",
    authMiddleware,
    authorizeRoles("admin"),
    getAllStores
);


// =====================================================
// TEMPORARY ADMIN TEST
// =====================================================

router.get(
    "/admin-test",
    authMiddleware,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin!"
        });
    }
);


// =====================================================
// TEMPORARY GET ALL USERS
// =====================================================

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
});


module.exports = router;