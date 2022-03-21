import { Url } from "../model/urlsModel.js";
const getUrls = async (req, res) => {
  try {
    const userUrls = await Url.find({ owner: req.user._id }).populate({
      path: "owner",
      select: "username email phone",
    });
    return res.status(200).json({ data: userUrls });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
export { getUrls };
