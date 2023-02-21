const mongoose = require("mongoose");
const uri = process.env.MONGOOSE_URI;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.set("strictQuery", false);

mongoose
    .connect(uri, options)
    .then((result) => console.log("Mongoose Connected"))
    .catch((err) => console.log("error at mongoose"+err));

module.exports = mongoose.connection;
