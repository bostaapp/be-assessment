import { Request, Response } from 'express';
import { ICheck, ICheckUpdateInfo } from '../interfaces';
import { CheckService } from '../service/check.service';
import { StatusCodes } from 'http-status-codes';
import { ReportService } from '../../report/service/report.service';

const checkService = new CheckService();
const reportService = new ReportService();

export const createCheck = async (req: Request, res: Response) => {
  try {
    const check: ICheck = req.body;
    check.userId = req['userId'];
    const checkExist = await checkService.checkExistByUrl(
      check.url,
      check.userId
    );
    if (checkExist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: 'Check Already Exist !!' });
    }
    const data = await checkService.create(check);
    await reportService.create({
      userId: check.userId,
      checkId: data._id.toString(),
    });
    return res.status(StatusCodes.CREATED).send({ _id: data._id });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal Server Error', err });
  }
};

export const getCheck = async (req: Request, res: Response) => {
  try {
    const userId = req['userId'];
    const checkId = req.params.id;
    const checkExist = await checkService.checkExistById(checkId, userId);
    if (checkExist) {
      const data = await checkService.getCheckById(checkId, userId);
      return res.status(StatusCodes.OK).send({
        data,
      });
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ message: 'Check Not Found !!' });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal Server Error', err });
  }
};

export const getChecks = async (req: Request, res: Response) => {
  try {
    const userId = req['userId'];
    const data = await checkService.all(userId);
    return res.status(StatusCodes.OK).send({
      data,
    });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal Server Error', err });
  }
};

export const updateCheck = async (req: Request, res: Response) => {
  try {
    const userId = req['userId'];
    const checkId = req.params.id;
    const dataToBeUpdated: ICheckUpdateInfo = req.body;
    const checkExist = await checkService.checkExistById(checkId, userId);
    if (checkExist) {
      const data = await checkService.updateCheck(
        checkId,
        userId,
        dataToBeUpdated
      );
      return res.status(StatusCodes.OK).send({
        data,
      });
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ message: 'Check Not Found !!' });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal Server Error', err });
  }
};

export const deleteCheck = async (req: Request, res: Response) => {
  try {
    const userId = req['userId'];
    const checkId = req.params.id;
    const checkExist = await checkService.checkExistById(checkId, userId);
    if (checkExist) {
      const data = await checkService.deleteCheck(checkId, userId);
      return res.status(StatusCodes.OK).send({
        data,
      });
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ message: 'Check Not Found !!' });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal Server Error', err });
  }
};
