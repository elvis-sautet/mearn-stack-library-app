const express = require("express");
const router = express.Router();
const passport = require("passport");

// @desc Authenticate with google
// @desc GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
// @desc Dashboard
// @desc GET /auth/google/callback
router.get(
  "/google/callbackURL",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

// @desc Logout Users
// @route auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
