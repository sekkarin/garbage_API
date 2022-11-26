const express = require("express")
const { body } = require("express-validator")
const router = express.Router()
const User = require("../models/user")
const authController = require("../controllers/auth")
router.put('/singup',[
    body('email')
        .isEmail()
        .withMessage("Please entera valid email")
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-mail address already exists')
                    }
                })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .not()
        .isEmpty(),
    body('name')
        .trim()
        .isLength({ min: 5 })

], authController.sigup)


module.exports = router