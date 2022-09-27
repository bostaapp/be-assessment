import { _axios } from "../configurations/axiosConfig.js";
import { Url } from "../modules/urls/model/urlsModel.js";

const isAvailable = async (urlData) => {
  let status;
  try {
    const response = await _axios.get(urlData.url);
    if (response.status >= 100 && response.status <= 399) {
      status = true;
    } else {
      status = false;
    }
  } catch (error) {
    status = false;
  } finally {
    await Url.findByIdAndUpdate(urlData._id, {
      status,
    });
  }
};
export { isAvailable };
