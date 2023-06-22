const express = require("express");
const router = express.Router();

const clubController = require("../controllers/clubController");

router.get("/join", clubController.joinClubGET);
router.post("/join", clubController.joinClubPOST);

module.exports = router;