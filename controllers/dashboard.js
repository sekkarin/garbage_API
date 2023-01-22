const Invoice = require("../models/invoice");

exports.getInFormation = (req, res, next) => {
    let total = 0

    Invoice.find()
        .then(invoice => {
            for (const key in invoice) {
                total += parseInt(invoice[key].amount);;
                console.log(total);
            }
            res.status(200).json({ status: "ok",total:total })
        })
}