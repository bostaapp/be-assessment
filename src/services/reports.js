import httpStatus from "http-status";
import Checks from "../models/Check";
import Reports from "../models/Report";
import APIError from "../utils/api-error";

const ReportsService = {
    async getReportByCheckId({ checkId }, { userId }){
        const report = await Reports.findOne({ check: checkId });

        if(report.userId.toString() !== userId.toString()){
            throw new APIError({message: `User not authorized to access the Report for Check id: ${checkId}`, status: httpStatus.UNAUTHORIZED}) 
        }

        return report;
    },

    async getReportsByTags({ tags }, { userId }){
        const checkIds = await Checks.find({ tags: { $in: tags }, userId }).select("_id");
        console.log("======> " + checkIds)
        const reports = await Reports.find({ check: { $in: checkIds } });

        return reports;
    }
}

export default ReportsService;