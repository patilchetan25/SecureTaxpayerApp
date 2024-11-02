const mongoose = require('mongoose')
const {Schema} = mongoose

const pdfdocSchema = new Schema({
    title: String,
    pdf : String,
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
})

const PdfdocModel = mongoose.model("Pdfdoc", pdfdocSchema)

module.exports = PdfdocModel