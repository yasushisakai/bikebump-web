mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const roadSchema = new Schema({
    id: String,
    name: String,
    kind: String,
    geometry: {
        type: String,
        coordinates: [[Number, Number]]
    }
}, {collection: 'roads'});

module.exports = mongoose.model('road', roadSchema);