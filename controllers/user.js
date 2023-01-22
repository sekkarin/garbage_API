const User = require('../models/user')

exports.getUser = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200)
                .json({ users: users })
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}