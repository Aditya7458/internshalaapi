const mongoose = require("mongoose");
const studentModel = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is Required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      maxlength: [15, "Password should not exceed more then 15 characters"],
      maxlength: [4, "Password should have atleast 4 characters"],
      // match:[]
    },
  },
  { timeStamps: true }
);

const Student = mongoose.model("student", studentModel);

module.exports = Student;
