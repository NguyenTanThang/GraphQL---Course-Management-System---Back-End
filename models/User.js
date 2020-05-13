const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    email:  {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Admin"
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("users", schema);