const ServiceCategory = require("../models/ServiceCategory");
const asyncHandler = require("../utils/asyncHandler");

// ── Get all active categories (public) ─────────────────────────────
exports.getCategories = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  // Admin can see all
  if (req.user && req.user.role === "admin") {
    delete filter.isActive;
  }

  const categories = await ServiceCategory.find(filter).sort({ name: 1 });

  res.json({ success: true, data: categories });
});

// ── Create category (admin) ────────────────────────────────────────
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const category = await ServiceCategory.create({ name, slug, description, icon });

  res.status(201).json({ success: true, message: "Category created", data: category });
});

// ── Update category (admin) ────────────────────────────────────────
exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, isActive } = req.body;

  const update = {};
  if (name !== undefined) {
    update.name = name;
    update.slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (description !== undefined) update.description = description;
  if (icon !== undefined) update.icon = icon;
  if (isActive !== undefined) update.isActive = isActive;

  const category = await ServiceCategory.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  res.json({ success: true, message: "Category updated", data: category });
});

// ── Delete category (admin) ────────────────────────────────────────
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  res.json({ success: true, message: "Category deleted" });
});
