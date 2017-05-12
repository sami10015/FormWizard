var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectID = Schema.Types.ObjectID;
    Mixed = Schema.Types.Mixed

var User = new Schema({
    userData : Mixed,
    formData : Mixed,
    sectionNum : Number
});

mongoose.model('User', User);
module.exports = User;