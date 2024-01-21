const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Student = require("../models/studentModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { v4: uuidv4 } = require("uuid");

exports.resume = catchAsyncErrors(async (req, res, next) => {
  const { resume } = await Student.findById(req.id).exec();
  res.json({ message: "secure resume page!", resume });
});

exports.addeducation = catchAsyncErrors(async (req, res, next) => {
  // const student = await Student.findById(req.id).exec();
  // console.log(student.resume.education,"education");
  // // console.log({ ...req.body },"body");
  // // console.log(uuidv4(),"id");
  // const newEducation = { ...req.body, id: uuidv4() };
  // // console.log(newEducation,"newEducation");
  // student.resume.education.push(newEducation);
  // console.log(student, "after");
  // await student.save();
  await Student.findOneAndUpdate(
    {
      _id: req.id,
    },
    {
      $push: {
        "resume.education": { ...req.body, id: uuidv4() },
      },
    }
  );
  res.json({ message: "Education Added" });
});
