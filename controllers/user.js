// const user = require('../models/user');
const { validationResult } = require('express-validator');
const user = require('../models/user');
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
exports.getUserById = (req, res, next) => {
  const id_user = req.params.id
  User.findById(id_user)
    .then(user => {
      res.status(200)
        .json({ message: "Fetced user successfully", user: user, })
    })
    .catch(err => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })

};
exports.upDateUser = (req, res, next) => {

  const id_user = req.params.id
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;

    throw error;
  }
  const f_name = req.body.f_name;
  // console.log(f_name);
  const l_name = req.body.l_name;
  const house_on = req.body.house_on;
  const village = req.body.village;
  const province = req.body.province;
  const sub_district = req.body.sub_district;
  const district = req.body.district;
  const postal_code = req.body.postal_code;
  const email = req.body.email;

  User.findById(id_user)
    .then(user => {
      if (!user) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
      }
      user.f_name = f_name
      user.l_name = l_name
      user.house_on = house_on
      user.village = village
      user.province = province
      user.sub_district = sub_district
      user.district = district
      user.postal_code = postal_code
      user.email = email
      return user.save()
    })
    .then(result => {
      res.status(200).json({
        message: "user updated",
        post: result
      })
    })
    .catch(
      err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });

};