const express = require('express')
require('dotenv').config()
require( './database/mongoose')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})