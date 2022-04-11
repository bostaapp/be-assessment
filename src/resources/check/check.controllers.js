import { crudControllers } from "../../utils/crud";
import { Check } from "./check.model";
import { Report } from "../report/report.model";
import { job } from "../../utils/events";
export default {
  ...crudControllers(Check),
  createOne: async (req, res) => {
    const createdBy = req.user._id;
    try {
      const checkDoc = await Check.create({ ...req.body, createdBy });
      const reportDoc = await Report.create({
        relatedCheck: checkDoc._id,
        user: createdBy,
      });
      res.status(201).json({ checkData: checkDoc, reportData: reportDoc });
      // res.redirect(307, "/api/report"); //307 to make a post request ot create a report
      job.emit("startCheck", { checkDoc, reportDoc });
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  },
};
