const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerficationSchema = new Schema({
  uniqueString: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expireAt: { type: Date, expires: 3600 },
});

module.exports = mongoose.model("Verfication", VerficationSchema);
