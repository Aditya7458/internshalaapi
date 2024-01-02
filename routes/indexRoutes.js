const express = require("express");
const { homepage, studentsignup } = require("../controllers/indexController");
const router = express.Router();


// Get /
router.get("/", homepage)


// POST/studdent/signup
router.post("/student/signup", studentsignup);

module.exports = router;