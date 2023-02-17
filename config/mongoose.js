const mongoose = require("mongoose");
const uri = process.env.MONGOOSE_URI;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.set("strictQuery", false);

mongoose.connect(uri, options);

exports.mongoose = mongoose;
