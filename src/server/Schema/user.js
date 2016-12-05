/**
 * Created by collinfijalkovich on 11/20/16.
 */

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    identifier: {type: String, required: true},
    fences: []
}, {collection: 'users'})

module.exports = mongoose.model('user', userSchema);