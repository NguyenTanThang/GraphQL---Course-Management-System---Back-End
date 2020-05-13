const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("courses", schema);