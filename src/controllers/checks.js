import ChecksServices from "../services/checks";
import httpStatus from "http-status";

const ChecksController = {
    async getAllChecks(req, res, next){
        const { _id: userId } = req.user;

        try{
            const response = await ChecksServices.getAllChecks({userId});
            res.status(httpStatus.OK).json(response);
        }
        catch(err){
            return next(err);
        }
    },

    async createCheck(req, res, next){
        const { body: checkData } = req;
        const { _id: userId } = req.user;

        try{
            const response = await ChecksServices.createCheck({ checkData }, { userId });
            res.status(httpStatus.CREATED).json(response);
        }
        catch(err){
            return next(err);
        }
    },

    async getCheckById(req, res, next){
        const { id: checkId } = req.params;
        const { _id: userId } = req.user;

        try{
            const response = await ChecksServices.getCheckById({checkId}, {userId});
            res.status(httpStatus.OK).json(response);
        }
        catch(err){
            return next(err);
        }
    },

    async updateCheck(req, res, next){
        const { id: checkId } = req.params;
        const { body: updatedData } = req;
        const { _id: userId } = req.user;

        try{
            const updatedCheck = await ChecksServices.updateCheck({checkId, updatedData}, {userId});
            res.status(httpStatus.OK).json(updatedCheck);
        }
        catch(err){
            return next(err);
        }
    },

    async deleteCheck(req, res, next){
        const { id: checkId } = req.params;
        const { _id: userId } = req.user;

        try{
            await ChecksServices.deleteCheck({checkId}, {userId});
            res.status(httpStatus.NO_CONTENT).end();
        }
        catch(err){
            return next(err);
        }
    }
}

export default ChecksController;