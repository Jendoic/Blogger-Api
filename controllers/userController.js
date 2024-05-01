const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const register = asyncHandler(async(req, res) => {
    const { username, email, password } = req.body
    if(!username || !email || !password){
        res.status(400)
        throw new Error('Please provide username, email and password')
    }
    const existingUser = await User.findOne({email})
    if(existingUser){
        res.status(400)
        throw new Error('User already exists')
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword
    })
    if (newUser) {
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }

});


const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error('Please provide email and password')
    }
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({_id: user._id, user:user.username, email:user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
        res.status(200).json(accessToken)
    }else{
        res.status(401)
        throw new Error('Invalid email or password')
    }

});


const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user)

})




module.exports = {
    register,
    login,
    currentUser,
  
}