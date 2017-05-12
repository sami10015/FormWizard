var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Artifact = require('./Artifact.js')
var Group = require('./Group.js');

var Page = new Schema({
    artifacts: [Artifact],
    template: String,
    pageNumber: Number,
    groups: [Group],
    image: {data: Buffer, contentType: String}
});

mongoose.model('Page', Page);
module.exports = Page;
