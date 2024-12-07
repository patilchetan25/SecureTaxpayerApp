const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    "email": {
      "type": String,
      "unique": true
    },
    "isAdminUser": {
      "type": "Boolean"
    },
    "password": {
      "type": "String"
    },
    "firstName": {
      "type": "String"
    },
    "lastName": {
      "type": "String"
    },
    "phoneNumber": {
      "type": "String"
    },
    "ssn": {
      "type": "String"
    },
    "streetAddress": {
      "type": "String"
    },
    "zipCode": {
      "type": "String"
    },
    "state": {
      "type": "String"
    },
    "city": {
      "type": "String"
    },
    "dateOfBirth": {
      "type": "String"
    },
    "maritalStatus": {
      "type": "String"
    },
    "filingStatus": {
      "type": "String"
    },
    "spouseSSN": {
      "type": "String"
    },
    "spouseFirstName": {
      "type": "String"
    },
    "spouseLastName": {
      "type": "String"
    },
    "spouseDateOfBirth": {
      "type": "String"
    },
    "spousePhoneNumber": {
      "type": "String"
    },
    "spouseStreetAddress": {
      "type": "String"
    },
    "spouseZipCode": {
      "type": "String"
    },
    "spouseState": {
      "type": "String"
    },
    "spouseCity": {
      "type": "String"
    },
    "failedAttempts": {
      "type": "Number",
      "default": "0" // Valor inicial
    },
    "isVerified": { "type": "Boolean"},
    "isBlocked": { "type": "Boolean", "default": "false" },
    "isSubmitted": { "type": "Boolean", "default": "false" },
  }
  )

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel