var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectID = Schema.ObjectID;
var Form = require('./Form.js');

var Category = new Schema({
    name: String,
    form: {
        type: Schema.ObjectId,
        ref: 'Form'
    }
});

mongoose.model('Category', Category);
module.exports = Category;