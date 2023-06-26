const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

router.get("/", postController.getPosts);
router.get("/create", postController.createPostForm);
router.post("/create", postController.createPost);

router.get("/delete/:postId", postController.deleteConfirmation);
router.post("/delete/:postId", postController.deletePost);

module.exports = router;