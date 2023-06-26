const createError = require("http-errors");

const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        next(createError(404));
    }
};

module.exports = isAdmin;