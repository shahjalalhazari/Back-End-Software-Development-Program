const express = require("express");
const Joi = require("joi");
const sanitizeHtml = require('sanitize-html');

const router = express.Router();

// NEW BLOG MODEL / CLASS
class Blog {
    constructor({id, title, content, author}) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdAt = new Date();
    }
}

// STORE BLOGS
const allBlogs = [];
let BlogId = 1;

// BLOG SCHEMA FOR DATA VALIDATION
const blogSchema = Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().min(10).required(),
    author: Joi.string().required(),
});

// POST NEW BLOG
router.post("/blogs", (req, res) => {
    // VALIDATE INPUTED DATA
    const {value, error} = blogSchema.validate(req.body);
    // IF INVALID INPUT DATA
    if (error) return res.status(400).json({"error": error.details[0].message})

    // SANITIZE ALL VALUES
    const sanitizedTitle = sanitizeHtml(value.title, {
        allowedTags: [],
        allowedAttributes: {}
    });
    const sanitizedContent = sanitizeHtml(value.content, {
        allowedTags: [],
        allowedAttributes: {}
    });
    const sanitizedAuthor = sanitizeHtml(value.author, {
        allowedTags: [],
        allowedAttributes: {}
    });

    // CREATE A BLOG MODEL / CLASS
    const newBlog = new Blog({
        id: BlogId++,
        title: sanitizedTitle,
        content: sanitizedContent,
        author: sanitizedAuthor
    });

    // ADD NEW BLOG TO ALL BLOGS LIST
    allBlogs.push(newBlog);

    res.status(201).json({
        "message": "Blos post created successfully",
        post: newBlog,
    });
});


// GET ALL THE BLOGS
router.get("/blogs", (req, res) => {
    // IF BLOG LIST IS EMPTY RETURN ERROR MESSAGE
    if (allBlogs.length < 1) {
        return res.status(404).send("No blog found!")
    };

    // FINALLY SEND ALL BLOGS
    res.status(200).send(allBlogs);
});


// GET BLOG POST BY ID
router.get("/blog/:id", (req, res) => {
    // GET THE ID & VALIDATED THE ID
    const BlogId = req.params.id;
    if (!BlogId || BlogId < 1) return res.status(400).json({"error": "Please provide an id in postive number!"})

    // FIND THE BLOG BY ID. IF THERE IS NO BLOG RETURN ERROR MESSAGE
    const blog = allBlogs.find(blog => blog.id == BlogId);
    if (!blog) return res.status(404).json({"error": `Blog post with ID ${BlogId} not found!`})

    // FINALLY SEND THE BLOG
    res.status(200).send(blog)
});


module.exports = router;