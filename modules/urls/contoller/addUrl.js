import { Url } from "../model/urlsModel.js";

const addUrl = async (req, res) => {
  try {
    const { name, url } = req.body;
    // console.log(req.user);
    const newUrl = await Url.insertMany({
      name,
      url,
      owner: req.user._id,
    });
    res.status(201).json({ message: "urlcheck created", data: newUrl });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export { addUrl };
