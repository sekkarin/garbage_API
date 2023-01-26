const express = require('express')
const router = express.Router()
const orderController = require("../controllers/order")
const isAuth = require('../middlewares/is-auth')
router.get("/orderInit",isAuth, orderController.initOrder)
router.get("/order",isAuth, orderController.getorder)
router.post("/checkout/:id_order",isAuth, orderController.checkout)

module.exports = router