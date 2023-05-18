import httpStatus from "http-status";
import Checks from "../models/Check";
import APIError from "../utils/api-error";
import _ from "lodash";
import cron from 'node-cron'
import upsertCheckReport from "../jobs/generate-check-report";

async function cronJobFunction(check){
    console.log("Balabizo")
}

const ChecksServices = {
    async getAllChecks(){
        const checks = await Checks.find().lean();
        return checks;
    },

    async createCheck({ checkData }){
        const createdCheck = await Checks.create(checkData);

        cron.schedule(`*/${createdCheck.interval} * * * *`, () => upsertCheckReport(createdCheck));

        return createdCheck;
    },

    async getCheckById({ checkId }){
        const check = await Checks.findOne({_id: checkId}).lean();

        if(_.isNil(check)){
            throw new APIError({message: `No check found with id: ${checkId}`, status: httpStatus.NOT_FOUND})
        }

        return check;
    },

    async updateCheck({ checkId, updatedData }) {
        const updatedCheck = await Checks.findByIdAndUpdate(
          checkId, updatedData, { new: true, runValidators: true }
        );
      
        if (_.isNil(updatedCheck)) {
          throw new APIError({
            message: `No check found with id: ${checkId}`,
            status: httpStatus.NOT_FOUND
          });
        }
      
        return updatedCheck;
      },

    async deleteCheck({ checkId }) {
        const check = await Checks.findOne({ _id: checkId });
      
        if (_.isNil(check)) {
          throw new APIError({
            message: `No check found with id: ${checkId}`,
            status: httpStatus.NOT_FOUND
          });
        }
      
        await check.deleteOne({_id: checkId});
      }
}

export default ChecksServices;