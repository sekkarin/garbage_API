const mongodb = require("mongoose")
const Schema = mongodb.Schema

const invoiceSchema =  new Schema({
    amount:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    }
},{timestamps:true})
module.exports = mongodb.model("Invoice",invoiceSchema)