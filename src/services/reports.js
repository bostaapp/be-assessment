import httpStatus from "http-status";
import Checks from "../models/Check";
import Reports from "../models/Report";
import APIError from "../utils/api-error";

const ReportsService = {
    /**
     * Get a report by its check ID for a given user
     *
     * @param {Object} checkId ID of the check associated with the report
     * @param {Object} userId User ID of the report owner
     *
     * @returns {Object} The report matching the specified check ID
     * @throws {APIError} If the user is not authorized to access the report
     */
    async getReportByCheckId({ checkId }, { userId }){
        const report = await Reports.findOne({ check: checkId });

        if(report.userId.toString() !== userId.toString()){
            throw new APIError({message: `User not authorized to access the Report for Check id: ${checkId}`, status: httpStatus.UNAUTHORIZED}) 
        }

        return report;
    },

    /**
     * Get reports by tags for a given user
     *
     * @param {Array} tags Array of tags to filter the reports
     * @param {Object} userId User ID of the reports owner
     *
     * @returns {Array} An array of reports matching the specified tags
     */
    async getReportsByTags({ tags }, { userId }){
        const checks = await Checks.find({ tags: { $in: tags }, userId });
        const checkIds = checks.map((check) => check._id);
        
        const reports = await Reports.find({ check: { $in: checkIds } });

        return reports;
    }
}

export default ReportsService;