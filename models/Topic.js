const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    courseID: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("topics", schema);