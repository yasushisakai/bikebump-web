mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const questionSchema = new Schema({
    id: String,
    text: String,
    options: [[String, String]],
    parent_id: string
}, {collection: 'questions'});

module.exports = mongoose.model('question', questionSchema);