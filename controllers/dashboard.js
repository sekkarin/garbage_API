const Invoice = require("../models/invoice");
const user = require("../models/user");

exports.getInFormation = (req, res, next) => {
    let total = 0

    Invoice.find()
        .then(invoice => {
            for (const key in invoice) {
                total += parseInt(invoice[key].amount);;
                // console.log(total);
            }
            user.find()
                .count()
                .then(userCout => {
                    res.status(200).json({ status: "ok", total: total,totaluser:userCout })
                })
        })
}