const mongoose = require('mongoose');
const schema = mongoose.Schema;

var searchSchema = new schema({
    term: String,
    when: String
});

const modelClass = mongoose.model('search', searchSchema);
module.exports = modelClass;