const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel');


const getBlogs = asyncHandler(async(req, res) => {
    const blogs = await Blog.find()
    res.status(200).json(blogs)

});


const createBlog = asyncHandler(async(req, res) => {
    const { title, content} = req.body

    if (!title || !content) {
        res.status(400);
        throw new Error('Please provide all necessary fields');
    }
    const newBlog = await Blog.create({ title, content, author:req.user._id});
    res.status(201).json(newBlog);
});


const getBlog = asyncHandler(async(req, res) => {


});


const updateBlog = asyncHandler(async(req, res) => {


});


const deleteBlog = asyncHandler(async(req, res) => {


});

module.exports = {
    getBlogs,
    createBlog,
    getBlog,
    updateBlog,
    deleteBlog,
}