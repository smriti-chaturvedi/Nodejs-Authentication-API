const jwt = require('jsonwebtoken')

const authMiddleware = (req, res , next) => {
    const token = req.header('auth-token')
    if(!token) {
        return res.status(401).send('Access Denied!')
    }

    try{
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified
        next()
    }catch(e) {
        res.sendStatus(400)
    }
}

module.exports = authMiddleware