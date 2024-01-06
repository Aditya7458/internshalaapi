require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

// db connection
require("./models/database").connectDatabase();

// logger
const logger = require("morgan");
app.use(logger("tiny"));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session and cokie
const session = require("express-session");
const cokieparser = require("cookie-parser");

// express-fileupload
const fileupload = require("express-fileupload");
app.use(fileupload());


app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(cokieparser());

// get route /
app.use("/", require("./routes/indexRoutes"));

// error handling
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedErrors } = require("./middlewares/error");
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested Url Not Found ${req.url}`, 404));
});
app.use(generatedErrors);

// port created
app.listen(
  process.env.PORT,
  console.log(`Server running on port ${process.env.PORT}`)
);
