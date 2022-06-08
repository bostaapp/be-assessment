import { Url } from "../modules/urls/model/urlsModel.js";
import { toSeconds } from "../shared/milliSeconds.js";

const totalUpTime = async (urlData) => {
  try {
    await Url.findByIdAndUpdate(urlData._id, {
      totaleUpTime: urlData.totaleUpTime + toSeconds(process.env.CHECKINTERVAL),
    });
  } catch (error) {
    console.log("totalUpTime", error.message);
  }
};
export { totalUpTime };
