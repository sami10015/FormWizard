var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Fence = require('./Fence.js');

var Field = new Schema({
    fence: Fence,
    name: String,
    type: String,
    combo: String,
    radio: Boolean,
    prompt: String,
    whatsThis: String,
    tip: String,
    default: String,
    groupName: String,
    validation: String,
    optional: Boolean
});

mongoose.model('Field', Field);
module.exports = Field;