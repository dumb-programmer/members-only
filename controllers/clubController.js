const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/user");

const joinClubGET = [
    isAuthenticated,
    (req, res) => {
        res.render("join_club", { title: "Join Club" });
    }
];

const joinClubPOST = [
    isAuthenticated,
    async (req, res) => {
        const { password } = req.body;
        if (password == process.env.CLUB_PASSWORD) {
            await User.findByIdAndUpdate(req.user._id, { isMember: true });
            res.redirect("/");
        }
        else {
            res.render("join_club", { title: "Join Club", errors: [{ path: "password", msg: "Incorrect password" }], password });
        }
    }
];

module.exports = { joinClubGET, joinClubPOST };