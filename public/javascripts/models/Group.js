var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Field = require('./Field.js');

var Group = new Schema({
    name: String,
    radio: Boolean
});

mongoose.model('Group', Group);
module.exports = Group;