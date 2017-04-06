var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Field = require('./Field.js');
var Section = require('./Section.js');

// Abstract Artifact schema
var Artifact = new Schema({
	field : Field,
	section: Section
});

mongoose.model('Artifact', Artifact);

module.exports = Artifact;