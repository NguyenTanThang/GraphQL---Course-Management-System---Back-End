const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob:  {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true,
        unique: true
    },
    topicsIDs: {
        type: [String],
        default: [],
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("trainers", schema);