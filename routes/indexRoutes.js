const express = require("express");
const {
  homepage,
  studentsignup,
  studentsignin,
  studentsignout,
  currentUser,
  studentsendmail,
  studentforgetlink,
  studentresetpassword,
  studentupdate,
} = require("../controllers/indexController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// Get /
router.get("/", homepage);

// POST/studdent
router.post("/student", isAuthenticated, currentUser);

// POST/studdent/signup
router.post("/student/signup", studentsignup);

// POST/studdent/signin
router.post("/student/signin", studentsignin);

// GET/studdent/signOut
router.get("/student/signout", isAuthenticated, studentsignout);

// GET/studdent/forgot-link/id
router.get("/student/forgot-link/:id", studentforgetlink);

// POST/studdent/forget
router.post("/student/send-mail", studentsendmail);

// POST/studdent/reset-password/id
router.post(
  "/student/reset-password/:id",
  isAuthenticated,
  studentresetpassword
);

// POST/studdent/Update/Student_id
router.post(
  "/student/update/:id",
  isAuthenticated,
  studentupdate
);

module.exports = router;
