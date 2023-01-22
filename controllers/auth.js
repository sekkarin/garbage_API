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
    const password = req.body.password
    const f_name = req.body.f_name
    const l_name = req.body.l_name
    const house_on = req.body.house_on
    const village = req.body.village
    const sub_district = req.body.sub_district
    const district = req.body.district
    const province = req.body.province
    const postal_code = req.body.postal_code
    const imageUrl = req.body.imageUrl
    // const status = req.body.status
    bcrypt.hash(password, 12)
        .then(hashPw => {
            const user = new User({
                email: email,
                password: hashPw,
                f_name: f_name,
                l_name: l_name,
                house_on: house_on,
                village: village,
                sub_district: sub_district,
                district: district,
                district: district,
                postal_code: postal_code,
                imageUrl: imageUrl,
                province: province,
                status: "User",
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
            const token = jwt.sign({ email: loadUser.email, userId: loadUser._id.toString(),status:loadUser.status },
             'Hello world', { expiresIn: '120d' })
            
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