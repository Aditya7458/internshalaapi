const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
      minlength: [4, "Password should have atleast 4 characters"],
      // match:[]
    },
  },
  { timeStamps: true }
);
studentModel.pre("save", function (next) {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

studentModel.methods.comparepassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const Student = mongoose.model("student", studentModel);

module.exports = Student;
