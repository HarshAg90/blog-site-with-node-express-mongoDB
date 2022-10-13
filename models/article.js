const mongoose = require('mongoose')
const { marked } = require('marked')
const slugify  = require("slugify")
// we import 'dompurify jsdom' because it enables node to render html itself,
// node is imcapable to do that on its own
const createDomPurify = require('dompurify')
const{ JSDOM } = require('jsdom')
// and also dompurify clears malicious code that could be passed through this
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type:String
    },
    markdown:{
        type:String,
        requireed: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    // this will INSTANTIATE the slug prop
    slug:{
        type: String,
        required: true,
        unique: true
    },
    // this will INSTANTIATE html code
    sanitizedHtml:{
        type: String,
        require:true
    }
})

// converting title name to url hash to make it better
// this function take in input a "next", make sure to provide it
articleSchema.pre('validate',function(next){
    // if title exist, create url friendly string out of it for better user experience
    if(this.title){
        this.slug = slugify(this.title, {lower:true, strict:true})
    }
    // if markdown is passed, convert it to html
    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }

    // call the next fn
    next()
})

module.exports = mongoose.model('Artile', articleSchema)