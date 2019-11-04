var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String, 
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true,
        unique: true
    },
    notes: {
        type:Schema.Types.ObjectId,
        ref: "Notes"
    }, 
    isSaved: {
        type: Boolean,
        default: false
    },
    fullLink: String

});

ArticleSchema.methods.setFullLink = function(){
    fullLink = "https://www.nytimes.com"+link
    return fullLink
}


// UserSchema.methods.setFullName = function() {
//     this.fullName = this.firstName + " " + this.lastName;
//     return this.fullName;
//   };
  
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;