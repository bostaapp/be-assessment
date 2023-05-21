import httpStatus from "http-status";
import Checks from "../models/Check";
import Users from "../models/User";
import APIError from "../utils/api-error";
import _ from "lodash";
import cron from 'node-cron'
import upsertCheckReport from "../jobs/generate-check-report";


const ChecksServices = {

  
  /**
   * Get all checks for a given user
   *
   * @param {Object} userId User ID to retrieve checks for
   *
   * @returns {Array} An array of checks belonging to the specified user
   */
    async getAllChecks({userId}){
      const checks = await Checks.find({userId});
      return checks;
    },


  /**
   * Create a new check for a given user
   *
   * @param {Object} checkData Data for the new check
   * @param {Object} userId User ID of the check owner
   *
   * @returns {Object} The newly created check
   */
    async createCheck({ checkData }, { userId }){
      const createdCheck = await Checks.create({ userId, ...checkData });
      const { email: userEmail } = await Users.findOne({ _id: userId });

      await upsertCheckReport(createdCheck, { userEmail });

      const job = cron.schedule(`*/${createdCheck.interval} * * * *`, () => upsertCheckReport(createdCheck, { userEmail }));
      createdCheck.job = job;

      return createdCheck;
    },


    /**
     * Get a check by its ID for a given user
     *
     * @param {Object} checkId ID of the check to retrieve
     * @param {Object} userId User ID of the check owner
     *
     * @returns {Object} The check matching the specified ID
     * @throws {APIError} If no check is found with the specified ID or if the user is not authorized to access the check
     */
    async getCheckById({ checkId }, { userId }){
      const check = await Checks.findOne({_id: checkId});

      if(_.isNil(check)){
          throw new APIError({message: `No check found with id: ${checkId}`, status: httpStatus.NOT_FOUND})
      }

      if(check.userId.toString() !== userId.toString()){
        throw new APIError({message: `User not authorized to access check with id: ${checkId}`, status: httpStatus.UNAUTHORIZED})
      }

      return check;
    },


    /**
     * Update a check for a given user
     *
     * @param {Object} checkId ID of the check to update
     * @param {Object} updatedData Updated data for the check
     * @param {Object} userId User ID of the check owner
     *
     * @returns {Object} The updated check
     * @throws {APIError} If no check is found with the specified ID or if the user is not authorized to update the check
     */
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


    /**
     * Delete a check by its ID for a given user
     *
     * @param {Object} checkId ID of the check to retrieve
     * @param {Object} userId User ID of the check owner
     *
     * @returns {Object} The check matching the specified ID
     * @throws {APIError} If no check is found with the specified ID or if the user is not authorized to access the check
     */
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