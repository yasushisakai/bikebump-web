const mongoose = require('mongoose'),
    road = require('../Schema/road'),
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
        answer: Number,
        timestamp: Number
    }],
    timestamp: Number,
    closestRoad: {
        road: {
            id: String,
            name: String,
            kind: String,
            geometry: {
                type: String,
                coordinates: [[Number, Number]]
            }
        },
        closestPt: {
            x: Number,
            y: Number,
            TILESIZE: Number
        },
        distance: Number,
        roadline:{
            st: {
                x: Number,
                y: Number,
                TILESIZE: Number
            },
            en: {
                x: Number,
                y: Number,
                TILESIZE: Number
            }
        }
    }
}, {collection: 'fences'});

module.exports = mongoose.model('fence', fenceSchema);