const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
        return;
    }
    res.redirect("/login");
};

module.exports = isAuthenticated;