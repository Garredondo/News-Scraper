var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    body: {
        type: String
    }
});

// create model using schema above
var Note = mongoose.model("Note", NoteSchema);

// export model
module.exports = Note;