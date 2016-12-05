const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const fenceSchema = new Schema({
    id: String,
    userid: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    radius: String,
    answer: [{
        userid: String,
        question: String,
        answer: String,
        timestamp: Number
    }],
    timestamp: Number
}, {collection: 'fences'});

module.exports = mongoose.model('fence', fenceSchema);