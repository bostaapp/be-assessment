import { Url } from "../modules/urls/model/urlsModel.js";

const history = async (urlData, status) => {
  try {
    await Url.findByIdAndUpdate(urlData._id, {
      $push: { history: { pullTime: Date.now(), available: status } },
    });
  } catch (error) {
    console.log(error);
  }
};
export { history };
