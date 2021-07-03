const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

// load the config file
dotenv.config({
  path: "./config/config.env",
});

// @desc passport cofig
require("./config/passport")(passport);

//@desc connect db with file imported
connectDB();

const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
//@desc morgan for loging requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// @desc using ejs template engine and other middlewares
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layouts");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "/public")));

// Sessions
app.use(
  session({
    secret: "Elvisproject",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    touchAfter: 24 * 3600, // time period in seconds
  })
);

// set passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// global variable
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/newStories"));

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
