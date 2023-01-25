const mongodb = require('mongoose')
const Schema = mongodb.Schema
const paymentOrderSchema = new Schema(
    {
        userid: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            // required: true
        }],
        date_paid: {
            type: Date
        },
        invoice_id:
        [{
            type: Schema.Types.ObjectId,
            ref: "Invoice",
            // required: true
        }],
        payment_id: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            // required: true
        }
        
    }
)
module.exports = mongodb.model("PaymentOrder", paymentOrderSchema)