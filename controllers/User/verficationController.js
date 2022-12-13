const Verfication = require("../../models/Verfication");
const User = require("../../models/User");

const handleVerfication = async (req, res) => {
  let { uniqueString } = req.params;
  const ver = await Verfication.findOne({ uniqueString: uniqueString });
  if (!ver) return res.sendStatus(404);
  await User.updateOne({ _id: ver.user }, { $set: { verficationState: true } });
  await Verfication.deleteOne({ uniqueString: uniqueString });
  return res.sendStatus(200);
};
module.exports = { handleVerfication };
