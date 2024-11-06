const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    firstName: String,
    email: {
        type: String,
        unique: true
    },
    isAdminUser:Boolean,
    password:String,
    lastName:String,
    phoneNumber:String,
    ssn:String,
    streetAddress:String,
    zipCode:String,
    state:String,
    city:String,
    dateOfBirth:String
    
})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel