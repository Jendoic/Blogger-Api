const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateTokenHandler')
const {register, login, currentUser} = require('../controllers/userController')



router.route('/register').post(register)
router.route('/login').post(login)
router.get('/current', validateToken, currentUser)

module.exports = router