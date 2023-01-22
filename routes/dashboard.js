const express = require('express');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();
const DashBoardController = require('../controllers/dashboard')

router.get('/information',DashBoardController.getInFormation)




module.exports = router;