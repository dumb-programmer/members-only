const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");

const signup = (req, res) => {
    res.render("signup", { title: "Signup" });
};

const createUser = async (req, res, next) => {
    const { first_name, last_name, email, password, confirm_password } = req.body;
    const salt = await bcrypt.genSalt();
    console.log(salt);
    bcrypt.hash(password, salt, async (err, hashed_password) => {
        if (err) {
            next(err);
        }
        console.log("creating user");
        const user = new User({ first_name, last_name, email, password: hashed_password });
        await user.save();
        res.redirect("/");
    })
};

const loginGET = (req, res) => {

};

const loginPOST = (req, res) => {

};

module.exports = { signup, createUser, loginGET, loginPOST };