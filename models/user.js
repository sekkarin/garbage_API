const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    f_name: {
        type: String,
        required: true
    },
    l_name: {
        type: String,
        required: true
    },
    house_on: {
        type: String,
        required: true
    },
    // หมู่บ้าน
    village: {
        type: String,
        required: true
    },
    // ตำบล
    sub_district: {
        type: String,
        required: true
    },
    // อำเภอ
    district: {
        type: String,
        required: true
    },
    // จังหวัด
    province: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        // required: true
        default:" "
    },
    status: {
        type: String,
        default: "User"
    }
}, { timestamps: true })

module.exports = mongoose.model("Users", userSchema)