const User = require("../models/user")
const { validationResult } = require("express-validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.sigup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array()
        throw error;
    }
    const email = req.body.email
    const name = req.body.name
    const password = req.body.password
    bcrypt.hash(password, 12)
        .then(hashPw => {
            const user = new User({
                email: email,
                password: hashPw,
                name: name
            })
            return user.save()
        })
        .then(result => {
            res.status(200)
                .json({ message: "User created", userId: result._id })
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
exports.login = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    let loadUser
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('A user this email could not be found')
                error.statusCode = 401
                throw error
            }
            loadUser = user
            return bcrypt.compare(password, loadUser.password)

        })
        .then(isEqul => {
            if (!isEqul) {
                const error = new Error("wrong password")
                error.ststusCode = 401
                throw error
            }
            const token = jwt.sign({ email: loadUser.email, userId: loadUser._id.toString() }, 'Hello world', { expiresIn: '1h' })
            res.status(200)
            .json({token:token,userId:loadUser._id.toString()})
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}