const express = require('express')
const router = express.Router()
const userController = require("../controllers/user")
router.get("/getuser", userController.getUser)
router.get("/getuser/:id", userController.getUserById)
router.put("/getuser/:id", userController.upDateUser)
router.put("/getuser/:id", userController.uploadimg)

module.exports = router