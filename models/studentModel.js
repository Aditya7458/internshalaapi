const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentModel = new mongoose.Schema(
  {
    avatar: {
      type: Object,
      default: {
        fileId: "",
        url: "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
      },
    },
    firstname: {
      type: String,
      required: [true, "First Name is Required"],
      unique: true,
      maxlength: [15, "First Name should not exceed more then 15 characters"],
      minlength: [4, "First Name should have atleast 4 characters"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name is Required"],
      unique: true,
      maxlength: [15, "Last Name should not exceed more then 15 characters"],
      minlength: [4, "Last Name should have atleast 4 characters"],
    },
    contact: {
      type: String,
      required: [true, "Contact is Required"],
      maxlength: [10, "Contact should not exceed more then 10 characters"],
      minlength: [10, "Contact should have atleast 10 characters"],
    },
    city: {
      type: String,
      required: [true, "City Name is Required"],
      minlength: [3, "City should have atleast 3 characters"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "male", "female", "other"],
    },
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
    resetPasswordToken: {
      type: String,
      default: "0",
    },
    resume: {
      education: [],
      jibd: [],
      internships: [],
      responsibilities: [],
      courses: [],
      projects: [],
      skills: [],
      accomplishments: [],
    },
  },
  { timestamps: true }
);
studentModel.pre("save", function (next) {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

studentModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

studentModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Student = mongoose.model("student", studentModel);

module.exports = Student;
