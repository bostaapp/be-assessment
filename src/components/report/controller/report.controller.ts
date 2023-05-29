import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ReportService } from '../service/report.service';
import { CheckService } from '../../check/service/check.service';

const reportService = new ReportService();
const checkService = new CheckService();

export const getReportsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req['userId'];
    const data = await reportService.getReportsByUserId(userId);
    return res.status(StatusCodes.OK).send({
      data,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Internal Server Error',
      err,
    });
  }
};

export const getReportByCheckId = async (req: Request, res: Response) => {
  try {
    const userId = req['userId'];
    const checkId = req.params.checkId;
    const checkExist = await checkService.checkExistById(checkId, userId);
    if (checkExist) {
      const data = await reportService.getReportByCheckId(checkId, userId);
      return res.status(StatusCodes.OK).send({
        data,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: 'Invalid Check Id',
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Internal Server Error',
      err,
    });
  }
};
