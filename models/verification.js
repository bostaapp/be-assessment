const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerficationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now ,
        index: { expires: 3600000 },
    },
});

module.exports = mongoose.model("Verfication", VerficationSchema);
