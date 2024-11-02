const mongoose = require('mongoose')
const {Schema} = mongoose

const adminSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password:String
})

const AdminModel = mongoose.model("Admin", adminSchema)

module.exports = AdminModel