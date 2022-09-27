import { _axios } from "../configurations/axiosConfig.js";
import { Url } from "../modules/urls/model/urlsModel.js";

const averageResponseTime = async (urlData) => {
  try {
    const response = await _axios.get(urlData.url);
    const responseTime = response.headers["request-duration"];
    if (!urlData.averageResponseTime) {
      await Url.findByIdAndUpdate(urlData._id, {
        averageResponseTime: responseTime,
      });
    }
    if (urlData.averageResponseTime) {
      await Url.findByIdAndUpdate(urlData._id, {
        averageResponseTime: Math.round(
          (urlData.averageResponseTime + responseTime) / 2
        ),
      });
    }
  } catch (error) {
    console.log("averageResponseTime", error.message);
  }
};
export { averageResponseTime };
