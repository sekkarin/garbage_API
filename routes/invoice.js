const express = require('express');
const { body } = require("express-validator")
const invoiceController = require('../controllers/invoice');
const isAuth = require('../middlewares/is-auth')
const router = express.Router();


router.get("/invoices",invoiceController.getInvoice);
router.get("/invoices/:id",invoiceController.getByInvoice);
router.post("/invoices",isAuth,invoiceController.createInvoice);
router.put("/invoices/:invoiceId",invoiceController.updateInvoice);
router.delete("/invoices/:invoiceId",invoiceController.deleteInvoice);



module.exports = router;