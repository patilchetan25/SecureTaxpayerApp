const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password:String
})

// Update your Mongoose schema
const DocumentSchema = new Schema({
    filename: String,
    path: String,
    userEmail: String, // Change userId to userEmail
  });

const UserModel = mongoose.model("User", userSchema)
const DocumentModel = mongoose.model("Document", DocumentSchema)


module.exports = UserModel
module.exports = DocumentModel