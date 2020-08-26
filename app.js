const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require('passport')
const config = require('./config/index')
//connect db
const mongoose = require("mongoose");
mongoose.connect(
  config.MONGODB_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const staffRouter = require("./routes/staff");
const shopRouter = require("./routes/shop");
const menuRouter = require("./routes/menu");

const app = express();
app.use(passport.initialize())

const errorHandler = require('./middleware/errorHandler')
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/user", userRouter);
app.use("/api/staff", staffRouter);
app.use("/api/shop", shopRouter);
app.use("/api/menu", menuRouter);


app.use(errorHandler)
module.exports = app;
