const Post = require("../models/post");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { body, validationResult } = require("express-validator");

const getPosts = async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("author");
    res.render("index", { posts, title: "Posts" });
};

const validatePost = [
    body("title").notEmpty().withMessage("Title is required").isLength({ max: 100 }).withMessage("Title can't be greater than 100 characters"),
    body("text").isLength({ max: 200 }).withMessage("Text can't be greater than 200 characters")
]

const createPostForm = [
    isAuthenticated,
    (req, res) => {
        res.render("post_form", { title: "Create Post" });
    }
]

const createPost = [
    isAuthenticated,
    ...validatePost,
    async (req, res) => {
        const { title, text } = req.body;
        const result = validationResult(req);
        const post = new Post({ title, text, author: req.user._id });
        if (result.isEmpty()) {
            post.save();
            res.redirect("/");
        }
        else {
            res.render("post_form", { errors: result.array(), data: post })
        }
    }
]

module.exports = { getPosts, createPostForm, createPost };