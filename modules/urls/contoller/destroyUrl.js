import { Url } from "../model/urlsModel.js";
const destroyUrl = async (req, res) => {
  try {
    const { id } = req.body;
    const isExist = await Url.findById(id).populate({
      path: "owner",
      select: "_id",
    });

    //check if url is exist
    if (!isExist) {
      return res.status(400).json({ message: "url not found" });
    }

    //terminate if url not belong to the same user
    if (req.user._id != isExist.owner._id) {
      return res.status(401).json({ message: "you are not authorized " });
    }

    const destroiedUrl = await Url.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted", data: destroiedUrl });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

export { destroyUrl };
