import { Url } from "../modules/urls/model/urlsModel.js";

const availability = async (urlData) => {
  try {
    const availabilityCalculation = Math.round(
      (urlData.totaleUpTime / (urlData.totaleUpTime + urlData.totaleDownTime)) *
        100
    );
    await Url.findByIdAndUpdate(urlData._id, {
      availability: (availabilityCalculation + availabilityCalculation) / 2,
    });
  } catch (error) {
    console.log(error);
  }
};
export { availability };
