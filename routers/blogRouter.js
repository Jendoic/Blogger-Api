const express = require('express')
const {getBlogs, createBlog, getBlog, 
        updateBlog, deleteBlog, getDraftedBlogs,
        likeBlog, unlikeBlog, addComment, 
        deleteComment, addCommentReply,
        deleteCommentReply} = require('../controllers/blogController')
const validateToken = require('../middlewares/validateTokenHandler')


const router = express.Router()

router.route('/').get(getBlogs).post(validateToken,createBlog)
router.route('/drafted').get(validateToken,getDraftedBlogs)
router.route('/:id').get(getBlog).put(validateToken,updateBlog).delete(validateToken,deleteBlog)
router.route('/:id/like').post(validateToken,likeBlog)
router.route('/:id/unlike').post(validateToken,unlikeBlog)
router.route('/:id/comment').post(validateToken,addComment)
router.route('/:id/comment/:commentId').delete(validateToken,deleteComment)
router.route('/:id/comment/:commentId/reply').post(validateToken,addCommentReply)
router.route('/:id/comment/:commentId/:replycomment').delete(validateToken,deleteCommentReply)

module.exports = router