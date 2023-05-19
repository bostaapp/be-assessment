import httpStatus from "http-status";
import Checks from "../models/Check";
import APIError from "../utils/api-error";
import _ from "lodash";
import cron from 'node-cron'
import upsertCheckReport from "../jobs/generate-check-report";


const ChecksServices = {
    async getAllChecks({userId}){
      const checks = await Checks.find({userId}).lean();
      return checks;
    },

    async createCheck({ checkData }, { userId }){
      const createdCheck = await Checks.create({ userId, ...checkData });

      const job = cron.schedule(`*/${createdCheck.interval} * * * *`, () => upsertCheckReport(createdCheck));
      createdCheck.job = job;

      return createdCheck;
    },

    async getCheckById({ checkId }, { userId }){
      const check = await Checks.findOne({_id: checkId}).lean();

      if(_.isNil(check)){
          throw new APIError({message: `No check found with id: ${checkId}`, status: httpStatus.NOT_FOUND})
      }

      if(check.userId.toString() !== userId.toString()){
        throw new APIError({message: `User not authorized to access check with id: ${checkId}`, status: httpStatus.UNAUTHORIZED})
      }

      return check;
    },

    async updateCheck({ checkId, updatedData }, { userId }) {
      const check = await Checks.findOne({ _id: checkId });
      
      if (_.isNil(check)) {
        throw new APIError({
          message: `No check found with id: ${checkId}`,
          status: httpStatus.NOT_FOUND
        });
      }

      if(check.userId.toString() !== userId.toString()){
        throw new APIError({message: `User not authorized to access check with id: ${checkId}`, status: httpStatus.UNAUTHORIZED})
      }
      
      updatedData.userId = userId;
      Object.assign(check, updatedData);
      
      await check.save();

      return check;
      
    },

    async deleteCheck({ checkId }, { userId }) {
      const check = await Checks.findOne({ _id: checkId });
    
      if (_.isNil(check)) {
        throw new APIError({
          message: `No check found with id: ${checkId}`,
          status: httpStatus.NOT_FOUND
        });
      }

      if(check.userId.toString() !== userId.toString()){
        throw new APIError({message: `User not authorized to access check with id: ${checkId}`, status: httpStatus.UNAUTHORIZED})
      }
    
      await check.deleteOne({_id: checkId});
    }
}

export default ChecksServices;