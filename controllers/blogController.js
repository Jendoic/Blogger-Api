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
})


const getBlog = asyncHandler(async(req, res) => {
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        res.status(404)
        throw new Error('Blog not found')
    }
    res.status(200).json(blog)
    

})


const updateBlog = asyncHandler(async(req, res) => {
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        res.status(404)
        throw new Error('Blog not found')
    }
    if(blog.author.toString() !== req.user._id){
        res.status(403)
        throw new Error("User don't have the permission to update other user blog post")
    }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedBlog)

});


const deleteBlog = asyncHandler(async(req, res) => {
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        res.status(404)
        throw new Error('Blog not found')
    }
    if(blog.author.toString() !== req.user._id){
        res.status(403)
        throw new Error("User don't have the permission to delete other user blog post")
    }
    await blog.findByIdAndDelete(blog)
    res.status(200).json({message: 'Blog deleted successfully'})

});

module.exports = {
    getBlogs,
    createBlog,
    getBlog,
    updateBlog,
    deleteBlog,
}