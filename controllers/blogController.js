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

/// LIKE AND UNLIKE OPERATIONS

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

/// ADD COMMENTS AND DELETE COMMENTS OPERATION

const addComment = asyncHandler(async(req, res) => {
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        res.status(404)
        throw new Error('Blog not found')
    }
    const newComment = await Blog.findByIdAndUpdate(req.params.id, {$push: {comments: req.body}}, {new: true})
    res.status(200).json(newComment)
})

const deleteComment = asyncHandler(async(req, res) => {
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        res.status(404)
        throw new Error('Blog not found')
    }
    if(!req.user){
        res.status(401)
        throw new Error("User is not authorized")
    }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {$pull: {comments: {_id: req.params.commentId}}}, {new: true})
    res.status(200).json(updatedBlog)
})


/// REPLY COMMENTS AND ALSO DELETE COMMENT REPLY

// const addCommentReply = asyncHandler(async(req, res) => {
//     const blog = await Blog.findById(req.params.id)
//     if(!blog){
//         res.status(404)
//         throw new Error('Blog not found')
//     }
//     const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {$push: {comments: {$each: [req.body], $position: 0}}}, {new: true})
//     res.status(200).json(updatedBlog)
// })


// const deleteCommentReply = asyncHandler(async(req, res) => {
//     const blog = await Blog.findById(req.params.id)
//     if(!blog){
//         res.status(404)
//         throw new Error('Blog not found')
//     }
//     if(!req.user){
//         res.status(401)
//         throw new Error("User is not authorized")
//     }
//     const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {$pull: {comments: {_id: req.params.commentId}}}, {new: true})
//     res.status(200).json(updatedBlog)
// })



const addCommentReply = asyncHandler(async (req, res) => {
    const { blogId, commentId } = req.params;
    const { content } = req.body;
  
    // Find the blog post by ID
    const blog = await Blog.findById(blogId);
  
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }
  
    // Find the comment by ID within the blog
    const comment = blog.comments.id(commentId);
  
    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }
  
    // Create a new reply object
    const newReply = {
      author: req.user._id, // Assuming user is authenticated and user ID is available in req.user
      content,
    };
  
    // Push the new reply to the replies array of the comment
    comment.replies.push(newReply);
  
    // Save the updated blog post
    await blog.save();
  
    res.status(201).json({ message: 'Reply added successfully', reply: newReply });
  });
  
  // Controller function to delete a reply from a comment
  const deleteCommentReply = asyncHandler(async (req, res) => {
    const { blogId, commentId, replyId } = req.params;
  
    // Find the blog post by ID
    const blog = await Blog.findById(blogId);
  
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }
  
    // Find the comment by ID within the blog
    const comment = blog.comments.id(commentId);
  
    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }
  
    // Find the reply by ID within the comment
    const reply = comment.replies.id(replyId);
  
    if (!reply) {
      res.status(404);
      throw new Error('Reply not found');
    }
  
    // Remove the reply from the replies array of the comment
    reply.remove();
  
    // Save the updated blog post
    await blog.save();
  
    res.status(200).json({ message: 'Reply deleted successfully' });
  });

module.exports = {
    getBlogs,
    getDraftedBlogs,
    createBlog,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    unlikeBlog,
    addComment,
    deleteComment,
    addCommentReply,
    deleteCommentReply
}