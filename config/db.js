const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log(`Database connected on ${conn.connection.host}:${conn.connection.port}`)
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;