/**
 * Created by collinfijalkovich on 11/20/16.
 */

mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    id: String,
    fences: []
}, {collection: 'users'});

module.exports = mongoose.model('User', userSchema);