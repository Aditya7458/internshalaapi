const express = require("express");
const {
  homepage,
  studentsignup,
  studentsignin,
  studentsignout,
} = require("../controllers/indexController");
const router = express.Router();

// Get /
router.get("/", homepage);

// POST/studdent/signup
router.post("/student/signup", studentsignup);

// POST/studdent/signin
router.post("/student/signin", studentsignin);

// GET/studdent/signOut
router.get("/student/signout", studentsignout);

module.exports = router;
