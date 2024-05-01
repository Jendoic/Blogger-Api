const express = require('express')
const {getBlogs, createBlog, getBlog, 
        updateBlog, deleteBlog, getDraftedBlogs,
        likeBlog, unlikeBlog} = require('../controllers/blogController')
const validateToken = require('../middlewares/validateTokenHandler')


const router = express.Router()

router.route('/').get(getBlogs).post(validateToken,createBlog)
router.route('/drafted').get(validateToken,getDraftedBlogs)
router.route('/:id').get(getBlog).put(validateToken,updateBlog).delete(validateToken,deleteBlog)
router.route('/:id/like').post(validateToken,likeBlog)
router.route('/:id/unlike').post(validateToken,unlikeBlog)

module.exports = router