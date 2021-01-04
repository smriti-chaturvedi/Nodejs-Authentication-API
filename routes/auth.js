const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../database/models/user')
const {registerValidation, loginValidation} = require('../validation')

const router = new express.Router()

router.post('/register', async (req, res) => {

    const {error} = registerValidation(req.body)
    if(error) {
        return res.status(400).send(error.details[0].message)
    }

    //Check if user already exists
    const emailExists = await User.findOne({email: req.body.email})
    if(emailExists) {
        return res.status(400).send("Email already exists")
    }

    //HashedPassword
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        await user.save()
        res.status(201).send({user: user._id})
    }catch(e) {
        res.status(400).send(e)
    }
})

router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body)
    if(error) {
        return res.status(400).send(error.details[0].message)
    }  

    //Checking if user exists
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return res.status(400).send('Email or password is wrong')
    }

    //Checking if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) {
        return res.status(400).send('Email or password is wrong')       
    }

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.SECRET)
    res.header('auth-token', token).send(token)

})

module.exports = router