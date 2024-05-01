const express = require('express');
const connectDB = require('./config/dbConfig')
const user = require('./routers/userRouter')
const blog = require('./routers/blogRouter');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config()
const app = express();
const Port = process.env.PORT || 8000


connectDB()
app.use(errorHandler)
app.use(express.json())
app.use('/api/v1/user', user)
app.use('/api/v1/blogs', blog)





app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});