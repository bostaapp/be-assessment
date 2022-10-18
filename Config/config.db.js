const mongoose = require("mongoose");

module.exports = async function connectDB() {
    try {
        await mongoose.connect(process.env.db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to DB");
    } catch (error) {
        console.log("Could not Connect to DB", error);
    }
};