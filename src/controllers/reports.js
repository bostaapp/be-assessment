import httpStatus from "http-status";
import ReportsService from "../services/reports";

const ReportsController = {
    async getReportByCheckId(req, res, next){
        const { checkId } = req.params;
        const {_id: userId} = req.user;

        try{
            const reponse = await ReportsService.getReportByCheckId({ checkId }, { userId });
            res.status(httpStatus.OK).json(reponse);
        }   
        catch(err){
            return next(err);
        }
    },

    async getReportsByTags(req, res, next){
        const { tags } = req.query;
        const {_id: userId} = req.user;

        try{
            const reponse = await ReportsService.getReportsByTags({ tags }, { userId });
            res.status(httpStatus.OK).json(reponse);
        }
        catch(err){
            return next(err);
        }
    }
}

export default ReportsController;