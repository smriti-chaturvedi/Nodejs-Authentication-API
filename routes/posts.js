const express = require('express')
const authMiddleware = require('../middleware/authentication')

const router = new express.Router()

router.get('/', authMiddleware, (req, res) => {
    res.send(req.user._id)
})

module.exports = router