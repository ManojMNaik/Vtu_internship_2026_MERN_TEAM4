const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/serviceCategory.controller");

// Public
router.get("/", ctrl.getCategories);

// Admin only
router.post("/", protect, authorizeRoles("admin"), ctrl.createCategory);
router.patch("/:id", protect, authorizeRoles("admin"), ctrl.updateCategory);
router.delete("/:id", protect, authorizeRoles("admin"), ctrl.deleteCategory);

module.exports = router;
