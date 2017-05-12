var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectID = Schema.ObjectID;
var Page = require('./Page.js');

var Form = new Schema({
    category: String,
    pages: [Page],
    name: String,
    company: String,
    suffix: String
});

mongoose.model('Form', Form);
module.exports = Form;
