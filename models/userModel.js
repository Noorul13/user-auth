const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/firstdatabase');

const userSchema = mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        minlength : 6,
        required: true,

    },
    name: {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    phone : {
        type: String,
        required: true,
        unique: true

    },
} , { timestamps: true })



const User = mongoose.model('User', userSchema);

module.exports = {User};