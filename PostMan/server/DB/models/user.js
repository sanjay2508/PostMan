const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friendsRequest: { type: Array, required: true },
    friends: { type: Array, required: true }
});

userSchema.plugin(validator);

module.exports = mongoose.model('User', userSchema);