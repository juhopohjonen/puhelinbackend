require('dotenv').config()

const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connectiong to', url)
mongoose.connect(url)
    .then (result => {
        console.log('connected to mongodb')
    })
    .catch((error) => {
        console.log('error connectiong to mongodb', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5
    },
    number: {
        type: String,
        minlength: 8,

        validate: {
            validator: function(value) {

                if (value.includes('-') == false) {
                    return false
                }

                let splitted = value.split('-')
                return splitted[0].length <= 3 && splitted[0].length >= 2 && splitted[1].length > 5 && splitted.length == 2 ? true : false

            }
        }
    },
    date: Date
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)