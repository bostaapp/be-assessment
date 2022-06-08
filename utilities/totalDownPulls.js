import { Url } from "../modules/urls/model/urlsModel.js";
const totalDownPulls = async (urlData) => {
  try {
    await Url.findByIdAndUpdate(urlData._id, {
      totalDownPulls: urlData.totalDownPulls + 1,
    });
  } catch (error) {
    console.log(error);
  }
};
export { totalDownPulls };
