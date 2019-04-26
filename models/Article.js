var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// creates the model using the above schema definition
var Article = mongoose.model("Article", ArticleSchema);

// export model
module.exports = Article;