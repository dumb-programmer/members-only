require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const RateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./models/user");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const clubRouter = require("./routes/clubRouter");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connection established");
  }
  catch (error) {
    console.error("Couldn't connect to MongoDB");
  }
})();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
app.use(limiter);
app.use(compression());
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" && true, maxAge: 30 * 24 * 60 * 60 * 1000 }
}));
passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, {
        message: `No such user exists:${email}:${password}`,
      });
    }
    bcrypt.compare(password, user.password, (error, res) => {
      if (error) {
        return done(error);
      }
      else if (res) {
        return done(null, user);
      }
      return done(null, false, { message: `Incorrect password:${email}:${password}` });
    });
  }
  catch (error) {
    done(error);
  }
}));
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  };
});
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
})

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/post", postRouter);
app.use("/club", clubRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
