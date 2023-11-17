const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    korisnickoIme: {
        type: String,
        required: true,
        min: 2,
        max: 60,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 30,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    grupe: {
        type: Array,
        default: []
    },
},
{timestamps: true }
);

module.exports = mongoose.model('User', userSchema);