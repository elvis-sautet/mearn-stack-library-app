const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/story");
// @desc Login/Landing page
// @desc GET /login
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    title: "login",
  });
});

// @desc Dashboard
// @desc GET /dashboard
const { formatDate } = require("../helpers/ejs");

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id })
      .sort({ createdAt: "desc" })
      .lean();
    res.render("dashboard", {
      title: "Dashboard",
      user: req.user.displayName,
      stories: stories,
      formatDate,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500", {
      title: "505 error",
    });
  }
});

module.exports = router;
