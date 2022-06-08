import { Url } from "../modules/urls/model/urlsModel.js";
import { toSeconds } from "../shared/milliSeconds.js";

const totalDownTime = async (urlData) => {
  try {
    await Url.findByIdAndUpdate(urlData._id, {
      totaleDownTime:
        urlData.totaleDownTime + toSeconds(process.env.CHECKINTERVAL),
    });
  } catch (error) {
    console.log(error);
  }
};

export { totalDownTime };
