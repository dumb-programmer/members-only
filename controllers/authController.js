const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const passport = require("passport");

const signup = (req, res) => {
    res.render("signup", { title: "Signup" });
};

const createUser = async (req, res, next) => {
    const { first_name, last_name, email, password, confirm_password } = req.body;
    const salt = await bcrypt.genSalt();
    bcrypt.hash(password, salt, async (err, hashed_password) => {
        if (err) {
            next(err);
        }
        const user = new User({ firstName: first_name, lastName: last_name, email, password: hashed_password });
        await user.save();
        res.redirect("/");
    })
};

const loginGET = (req, res) => {
    res.render("login", { title: "Login" });
};

const loginPOST = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
});

const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    })
}

module.exports = { signup, createUser, loginGET, loginPOST, logout };