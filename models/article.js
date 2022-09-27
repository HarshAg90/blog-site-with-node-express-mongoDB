const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title:{
        required: true,
        type: String
    },
    description:{
        type:String
    },
    markdown:{
        type:String,
        requireed: true
    },
    createAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Artile', articleSchema)