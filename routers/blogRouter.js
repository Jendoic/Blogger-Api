const express = require('express')
const {getBlogs, createBlog, getBlog, updateBlog, deleteBlog, getDraftedBlogs} = require('../controllers/blogController')
const validateToken = require('../middlewares/validateTokenHandler')


const router = express.Router()

router.route('/').get(getBlogs).post(validateToken,createBlog)
router.route('/drafted').get(validateToken,getDraftedBlogs)
router.route('/:id').get(getBlog).put(validateToken,updateBlog).delete(validateToken,deleteBlog)


module.exports = router