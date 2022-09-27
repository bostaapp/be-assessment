import { Url } from "../modules/urls/model/urlsModel.js";

const totalUpPulls = async (urlData) => {
  try {
    await Url.findByIdAndUpdate(urlData._id, {
      totalUpPulls: urlData.totalUpPulls + 1,
    });
  } catch (error) {
    console.log("totalUpPulls", error.message);
  }
};

export { totalUpPulls };
