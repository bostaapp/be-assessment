import { Url } from "../model/urlsModel.js";

const addUrl = async (req, res) => {
  try {
    const { name, url } = req.body;
    console.log(name, url);
  } catch (error) {}
};

export { addUrl };
