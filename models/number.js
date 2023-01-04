/* eslint-disable */
require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
.then(result => {console.log('connected to MongoDB')})
.catch((error) => {console.log('error connecting to MongoDB:', error.message)})

const numberSchema = new mongoose.Schema({
    id: String,
    name: {type:String, minlength:3, required:true},
    number: {type:String, minlength:12,validate:{validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      }, message:props=>`${props.value} is not a valid phone number`}, required:true}
})

numberSchema.set('toJSON', {transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
}})

module.exports = mongoose.model('Number', numberSchema)
