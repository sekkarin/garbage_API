const { Result, validationResult } = require('express-validator');
const Order = require('../models/paymentOrder')


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
    const id = req.params.id
    console.log(userId);

    Order.find({ userid: userId })
        // .select('invoice_id')
        .then(order => {
            res.status(200)
                .json({ order: order })
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    // console.log(order);
}
exports.checkout = async (req, res, next) => {
    const errors = validationResult(req);
    const id_order = req.params.id_order
    const invoice_id = req.body.invoice_id
    // console.log("id_invoice",invoice_id);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    // const userId = req.userId

    Order.findById(id_order)
        .then(order => {
            if (!order) {
                const error = new Error('Could not find order.');
                error.statusCode = 404;
                throw error;
            }
            // let order_arr =[...]
            // let order_arr = 
            // console.log(order_arr);
            // console.log(order.invoice_id.toString());

            order.invoice_id.push(invoice_id)
            order.save()
                .then(result => {
                    res.status(200)
                        .json({ order: result })
                }).catch(err => {
                    console.log(err);
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                })


        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    // console.log(order);
}