var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Section = new Schema({
    title: String,
    secNumber: Number,
    type: String,
    prompt: String
});

mongoose.model('Section', Section);
module.exports = Section;