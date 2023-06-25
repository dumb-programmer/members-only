const bcrypt = require("bcrypt");
const User = require("../models/user");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

const signup = (req, res) => {
    res.render("signup", { title: "Signup" });
};

const validateUser = [
    body("first_name").notEmpty().withMessage("First name is required").isLength({ max: 50 }).withMessage("Fist name can't be greater than 50 characters"),
    body("last_name").notEmpty().withMessage("Last name is required").isLength({ max: 50 }),
    body("email").notEmpty().withMessage("Email is required").isEmail().custom(async val => {
        const user = await User.find({ email: val });
        if (user) {
            return Promise.reject(false);
        }
        return true;
    }).withMessage("A user with this email already exists"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be atleast 8 characters long"),
    body("confirm_password").notEmpty().withMessage("Confirm password is required").custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage("Password don't match"),
]

const createUser = [
    ...validateUser,
    async (req, res, next) => {
        const { first_name, last_name, email, password, confirm_password } = req.body;
        const result = validationResult(req);
        const salt = await bcrypt.genSalt();
        bcrypt.hash(password, salt, async (err, hashed_password) => {
            if (err) {
                next(err);
            }
            const user = new User({ firstName: first_name, lastName: last_name, email, password: hashed_password });
            if (result.isEmpty()) {
                await user.save();
                res.redirect("/");
            }
            else {
                res.render("signup", { title: "Sign up", errors: result.array(), userData: { ...user._doc, password: password, confirmPassword: confirm_password } });
            }
        })
    },
]

const loginGET = (req, res) => {
    let errors = [];
    const data = {};
    if (req.session.messages) {
        const latestMessage = req.session.messages[req.session.messages.length - 1];
        const [message, email, password] = latestMessage.split(":");
        data.email = email;
        data.password = password;
        if (latestMessage.match(/user/)) {
            errors.push({ path: "email", msg: message });
        }
        else if (latestMessage.match(/password/)) {
            errors.push({ path: "password", msg: message });
        }
    }
    res.render("login", { title: "Login", errors, data });
};

const validateCredentails = [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email must be an email"),
    body("password").notEmpty().withMessage("Password is required"),
]

const loginPOST = [
    ...validateCredentails,
    (req, res, next) => {
        const result = validationResult(req);
        const { email, password } = req.body;
        if (result.isEmpty()) {
            next();
        }
        else {
            res.render("login", { data: { email, password }, errors: result.array() });
        }
    },
    passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login", failureMessage: true })
]

const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    })
}

module.exports = { signup, createUser, loginGET, loginPOST, logout };