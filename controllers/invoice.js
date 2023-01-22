const { validationResult } = require("express-validator");
const Invoice = require("../models/invoice")

exports.getByInvoice = (req, res, next) => {
  const idInv = req.params.id
  Invoice.findById(idInv)
    .then(invoice => {
      res.status(200)
        .json({ message: "Fetced invoice successfully", invoice: invoice, })
    })
    .catch(err => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })

};
exports.getInvoice = (req, res, next) => {

  Invoice.find()
    .then(invoices => {
      res.status(200)
        .json({ message: "Fetced invoice successfully", invoices: invoices.reverse()})
    })
    .catch(err => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })

};

exports.createInvoice = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const amount = req.body.amount;
  const description = req.body.description;
  const status = req.body.status;
  const invoice = new Invoice({
    amount: amount,
    description: description,
    status: status,
  });
  invoice.save()
    .then(result => {
      res.status(201).json({
        message: 'invoice created successfully!',
        invoice: invoice,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateInvoice = (req, res, next) => {
  const invoiceId = req.params.invoiceId
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
  
    throw error;
  }
  const amount = req.body.amount;
  const description = req.body.description;
  const status = req.body.status ;

  Invoice.findById(invoiceId)
    .then(invoice => {
      if (!invoice) {
        const error = new Error('Could not find invoice.');
        error.statusCode = 404;
        throw error;
      }
      
      
      invoice.amount = amount
      invoice.description = description
      invoice.status = status
      invoice.save()
    })
    .then(result => {
      res.status(200).json({
        message: "invoice updated",
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
}
exports.deleteInvoice = (req, res, next) => {
  const invoiceId = req.params.invoiceId
  Invoice.findById(invoiceId)
    .then(
      invoice => {
        if (!invoice) {
          const error = new Error('Could not find invoice.');
          error.statusCode = 404;
          throw error;
        }
      
  
        return Invoice.findByIdAndRemove(invoiceId)
      }
    )
  .then(result => {
    // console.log(result);
    res.status(200).json({
      message: "deleted invoice"
    })
  })
    .catch(err => {
      console.log(err);
    })
}