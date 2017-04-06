var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Fence = new Schema({
    startX: Number,
    startY: Number,
    endX: Number,
    endY: Number
});

mongoose.model('Fence', Fence);
module.exports = Fence;