const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    }
    res.redirect("/login");
};

module.exports = isAuthenticated;