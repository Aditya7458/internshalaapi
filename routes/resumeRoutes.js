const express = require("express");
const { resume, addeducation, } = require("../controllers/resumeController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// Get /
router.get("/", isAuthenticated, resume);

// POST
router.post("/add-edu", isAuthenticated, addeducation);

module.exports = router;
