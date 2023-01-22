const { Result, validationResult } = require('express-validator');
const Order = require('../models/paymentOrder')
const Invoice = require('../models/invoice');
const invoice = require('../models/invoice');

exports.initOrder = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const userId = req.userId
    Order.find().select(userId)
        .then(user => {
            // console.log("userrrrrrr", user);
            if (user.length === 0) {
                const order = new Order({
                    userid: userId,
                });
                order.save()
                    .then(result => {
                        // console.log("init order   ==== ",result);
                        res.status(200).json({ msg: "Hello not found ", user: userId, result: result })
                    })
                    .catch(err => {
                        console.log(err);
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        next(err);
                    })
            } else {
                res.status(200)
                    .json({ msg: "order ready ", user: userId })
            }
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
exports.getorder = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const userId = req.userId

    const order = await Order.find({ userid: userId })

        // .populate('invoice_id')
        // .select('invoice_id')
        // .exists({name:'Amit'})
        .then(order => {
            // console.log(order);
            return order
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    console.log(order);
}