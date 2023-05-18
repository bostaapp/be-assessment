import ChecksServices from "../services/checks";
import httpStatus from "http-status";

const ChecksController = {
    async getAllChecks(req, res, next){
        try{
            const response = await ChecksServices.getAllChecks();
            res.status(httpStatus.OK).json(response);
        }
        catch(err){
            return next(err);
        }
    },

    async createCheck(req, res, next){
        const { body: checkData } = req;

        try{
            const response = await ChecksServices.createCheck({ checkData });
            res.status(httpStatus.CREATED).json(response);
        }
        catch(err){
            return next(err);
        }
    },

    async getCheckById(req, res, next){
        const { id: checkId } = req.params;

        try{
            const response = await ChecksServices.getCheckById({checkId});
            res.status(httpStatus.OK).json(response);
        }
        catch(err){
            return next(err);
        }
    },

    async updateCheck(req, res, next){
        const { id: checkId } = req.params;
        const { body: updatedData } = req;

        try{
            const updatedCheck = await ChecksServices.updateCheck({checkId, updatedData});
            res.status(httpStatus.OK).json(updatedCheck);
        }
        catch(err){
            return next(err);
        }
    },

    async deleteCheck(req, res, next){
        const { id: checkId } = req.params;

        try{
            await ChecksServices.deleteCheck({checkId});
            res.status(httpStatus.NO_CONTENT).end();
        }
        catch(err){
            return next(err);
        }
    }
}

export default ChecksController;