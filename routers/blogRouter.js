const express = require('express')
const {getBlogs, createBlog, getBlog, updateBlog, deleteBlog} = require('../controllers/blogController')
const validateToken = require('../middlewares/validateTokenHandler')


const router = express.Router()

router.route('/').get(getBlogs).post(validateToken,createBlog)
router.route('/:id').get(getBlog).put(validateToken,updateBlog).delete(validateToken,deleteBlog)


module.exports = router