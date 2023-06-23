const Post = require("../models/post");
const isAuthenticated = require("../middlewares/isAuthenticated");

const getPosts = async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("author");
    res.render("index", { posts, user: req.user, title: "Posts" });
};

const createPostForm = [
    isAuthenticated,
    (req, res) => {
        res.render("postForm", { title: "Create Post" });
    }
]

const createPost = async (req, res) => {
    const { title, text } = req.body;
    await Post.create({ title, text, author: req.user._id });
    res.redirect("/");
};

module.exports = { getPosts, createPostForm, createPost };