const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Student = require("../models/studentModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/SendToken");
const { sendmail } = require("../utils/nodemailer");
const path = require("path");
const imagekit = require("../utils/imageKit").initImageKit();

exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "homepage" });
});

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  res.json({ student });
});

exports.studentsignup = catchAsyncErrors(async (req, res, next) => {
  const student = await new Student(req.body).save();
  sendtoken(student, 201, res);
});



exports.studentsignin = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!student) {
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );
  }
  const isMatch = student.comparepassword(req.body.password);
  if (!isMatch) {
    return next(new ErrorHandler("Wrong credentials", 500));
  }
  sendtoken(student, 200, res);
});

exports.studentsignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully sign out" });
});

exports.studentsendmail = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email }).exec();
  if (!student) {
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );
  }
  const url = `${req.protocol}://${req.get("host")}/student/forgot-link/${
    student._id
  }`;

  console.log(student.resetPasswordToken, "before");
  sendmail(req, res, next, url);
  // student.resetPasswordToken = "1"
  await Student.findByIdAndUpdate(student._id, {
    resetPasswordToken: "1",
  });
  // await student.save();
  res.json({ student, url });
});

exports.studentforgetlink = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();
  if (!student) {
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );
  }
  if (student.resetPasswordToken == "1") {
    student.resetPasswordToken = "0";
    student.password = req.body.password;
    await student.save();
  } else {
    return next(
      new ErrorHandler("Invalid Reset Password Link! Please try again", 500)
    );
  }
  res.status(200).json({
    message: "Password has been successfully changed",
  });
});

exports.studentresetpassword = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  student.password = req.body.password;
  await student.save();
  sendtoken(student, 201, res);
});

exports.studentupdate = catchAsyncErrors(async (req, res, next) => {
  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // Return the updated document
      runValidators: true, // Run validators on update
    }
  ).exec();

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: updatedStudent,
  });
});

exports.studentavatar = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();
  const file = req.files.avatar;
  const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
    file.name
  )}`;

  if (student.avatar.fileId !== "") {
    await imagekit.deleteFile(student.avatar.fileId);
  }
  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });

  // student.avatar = { fileId, url };
  // await student.save();
  await Student.findByIdAndUpdate(student._id, {
    avatar: { fileId, url },
  });
  res
    .status(200)
    .json({ success: true, message: "avatar uploaded successfully" });
});
