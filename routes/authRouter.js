const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/signup", authController.signup);

router.post("/signup", authController.createUser);

router.get("/login", authController.loginGET);

router.post("/login", authController.loginPOST);

router.get("/logout", authController.logout);

module.exports = router;