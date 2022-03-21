import { Url } from "../model/urlsModel.js";

const addUrl = async (req, res) => {
  try {
    //For some reason you must url must start with a protocol not "www"
    //www.gmail.com => ERR_INVALID_URL
    //Will search for a resolver to get the protocol same as client browser
    //it can be fixed by regex though but for complex url i dont prefere
    const { name, url } = req.body;
    const isDuplicate = await Url.findOne({ url, owner: req.user._id });
    if (isDuplicate) {
      return res.status(400).json({ error: "urlcheck is duplicated" });
    }
    const newUrl = await Url.insertMany({
      name,
      url: new URL(url),
      owner: req.user._id,
    });
    res.status(201).json({ message: "urlcheck created", data: newUrl });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export { addUrl };
