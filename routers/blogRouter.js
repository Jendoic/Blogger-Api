const express = require('express')
const {getBlogs, createBlog, getBlog, updateBlog, deleteBlog} = require('../controllers/blogController')


const router = express.Router()

router.route('/').get(getBlogs).post(createBlog)
router.route('/:id').get(getBlog).put(updateBlog).delete(deleteBlog)


module.exports = router