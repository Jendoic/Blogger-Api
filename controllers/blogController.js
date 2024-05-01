const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel');


const getBlogs = asyncHandler(async(req, res) => {
    const blogs = await Blog.find({status: 'published'}).exec()
    res.status(200).json(blogs)

});

const getDraftedBlogs = asyncHandler(async(req, res) =>{  
    if(!req.user){
        res.status(401)
        throw new Error("User is not authorized")
    }
    const draftedBlogs = await Blog.find({author:req.user._id, status:'draft'}).exec();
    res.status(200).json(draftedBlogs)
})

const createBlog = asyncHandler(async(req, res) => {
    const { title, content, status} = req.body

    if (!title || !content) {
        res.status(400);
        throw new Error('Please provide all necessary fields');
    }
    if(status !== 'draft' && status !== 'published'){
        res.status(400);
        throw new Error('Please provide valid status');
    }
    const newBlog = await Blog.create({ title, content, status, author:req.user._id});
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
    await Blog.findOneAndDelete(req.params.id)
    res.status(200).json({message: 'Blog deleted successfully'})

})

const likeBlog = asyncHandler(async(req, res) =>{
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        res.status(404)
        throw new Error('Blog not found')
    }
    if(blog.likes.includes(req.user._id)){
        res.status(400)
        throw new Error("User already liked this blog")
    }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {$push: {likes: req.user._id}}, {new: true})
    res.status(200).json(updatedBlog)
})

const unlikeBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        res.status(404)
        throw new Error('Blog not found')
    }
    if(!blog.likes.includes(req.user._id)){
        res.status(400)
        throw new Error("User has not liked this blog")
    }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {$pull: {likes: req.user._id}}, {new: true})
    res.status(200).json(updatedBlog)
})

module.exports = {
    getBlogs,
    getDraftedBlogs,
    createBlog,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    unlikeBlog,
}