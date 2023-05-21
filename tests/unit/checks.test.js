import upsertCheckReport from '../../src/jobs/generate-check-report';
import Check from '../../src/models/Check';
import User from '../../src/models/User';
import ChecksServices from '../../src/services/checks';
import APIError from '../../src/utils/api-error';
import cron from 'node-cron';


jest.mock('../../src/models/Check');
jest.mock('../../src/models/User');
jest.mock('../../src/jobs/generate-check-report');
jest.mock('node-cron');

describe('Checks service', () => {
  describe('createCheck', () => {
    it('should create a new check for a given user', async () => {
      // Mock the input data
      const checkData = { /* mock check data */ };
      const userId = 'user1';
  
      // Mock the database response and function calls
      const createdCheck = { /* mock created check */ };
      const userEmail = 'test@example.com';
      const mockJob = { /* mock job object */ };
  
      Check.create.mockResolvedValueOnce(createdCheck);
      User.findOne.mockResolvedValueOnce({ email: userEmail });
      upsertCheckReport.mockResolvedValueOnce(/* mock result of upsertCheckReport */);
      cron.schedule.mockReturnValueOnce(mockJob);
  
      // Invoke the service function
      const result = await ChecksServices.createCheck({ checkData }, { userId });
  
      // Assertions
      expect(Check.create).toHaveBeenCalledWith({ userId, ...checkData });
      expect(User.findOne).toHaveBeenCalledWith({ _id: userId });
      expect(upsertCheckReport).toHaveBeenCalledWith(createdCheck, { userEmail });
      expect(cron.schedule).toHaveBeenCalledWith(`*/${createdCheck.interval} * * * *`, expect.any(Function));
      expect(result).toEqual(createdCheck);
      expect(result.job).toBe(mockJob);
    });
  });
  
  describe('getAllChecks', () => {
    it('should return an array of checks belonging to the specified user', async () => {
      // Mock the database response
      const mockChecks = [
        { _id: 'check1', name: 'Check 1', userId: 'user1' },
        { _id: 'check2', name: 'Check 2', userId: 'user1' },
      ];
      Check.find.mockResolvedValueOnce(mockChecks);
  
      // Invoke the service function
      const result = await ChecksServices.getAllChecks({ userId: 'user1' });
  
      // Assertions
      expect(Check.find).toHaveBeenCalledWith({ userId: 'user1' });
      expect(result).toEqual(mockChecks);
    });
  });

  describe('getCheckById', () => {
    it('should get a check by its ID for a given user', async () => {
      const checkId = 'check1';
      const userId = 'user1';
      const check = { userId: 'user1' };

      Check.findOne.mockResolvedValueOnce(check);

      const result = await ChecksServices.getCheckById({ checkId }, { userId });

      expect(Check.findOne).toHaveBeenCalledWith({ _id: checkId });
      expect(result).toEqual(expect.objectContaining(check));
    });

    it('should throw an error if no check is found with the specified ID', async () => {
      const checkId = 'nonexistent';
      const userId = 'user1';

      Check.findOne.mockResolvedValueOnce(null);

      await expect(ChecksServices.getCheckById({ checkId }, { userId })).rejects.toThrow(APIError);
    });

    it('should throw an error if the user is not authorized to access the check', async () => {
      const checkId = 'check1';
      const userId = 'unauthorized';
      const check = { userId: 'user1' };

      Check.findOne.mockResolvedValueOnce(check);

      await expect(ChecksServices.getCheckById({ checkId }, { userId })).rejects.toThrow(APIError);
    });
  });  
});

