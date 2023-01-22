const mongodb = require('mongoose')
const Schema = mongodb.Schema
const paymentSchema = new Schema(
    {
        status:{
            type:bool,
            default:false,
        },
        bank_name:{
            type:String,
            require:true
        }
    }
)
module.exports = mongodb.model("Payment",paymentSchema)