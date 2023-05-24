import { Response, Request } from "express";
import { CheckService } from "../services/check.service";
import { ICheck } from "../models/check";
import { ReportService } from "../services/report.service";

export const createCheck = async (req: Request, response: Response) => {
  try {
    // find if the check is already made by user
    console.log("test");

    const checkData: ICheck = req.body;
    const user = req.currentUser!.id;
    let check = await CheckService.findOne(checkData.url, user);
    if (check) throw new Error("check already exists");
    //create a new check
    check = await CheckService.createCheck(checkData, user);

    if (!check) throw new Error("Error creating check");
    response.status(201).json(check);
  } catch (error: any) {
    response
      .status(500)
      .json({ error: error.message || "Erorr creating check" });
  }
};

export const getCheck = async (req: Request, response: Response) => {
  try {
    const checkId = req.params.id;
    const check = await CheckService.findById(checkId, req.currentUser!.id);
    if (!check) throw new Error("Check not found");

    response.status(200).json(check);
  } catch (error: any) {
    response.status(404).json({ error: error.message });
  }
};

export const getAllChecks = async (req: Request, response: Response) => {
  try {
    //TODO:implement pagination and select certain fields
    const checks = await CheckService.findAll(req.currentUser!.id);
    if (!checks || checks.length === 0) throw new Error("Checks not found");

    response.status(200).json(checks);
  } catch (error: any) {
    response.status(404).json({ error: error.message });
  }
};

export const deleteCheck = async (req: Request, response: Response) => {
  const checkId = req.params.id;

  try {
    //TODO: USE DB TRANSACTION TO ONLY DELETE REPORT AND CHECK TOGETHER AND ROLLBACK IF ERROR HAPPENS
    const deleted = await CheckService.deleteCheck(
      checkId,
      req.currentUser!.id
    );
    if (!deleted) throw new Error("Error deleting check..");
    const deletedReport = await ReportService.deleteReport(checkId);

    return response
      .status(200)
      .json({ message: "Check deleted successfully.." });
  } catch (error: any) {
    return response.status(500).json({ message: error.message || "Error" });
  }
};

export const updateCheck = async (req: Request, response: Response) => {
  try {
    const checkId = req.params.id;
    const check = await CheckService.updateCheck(
      checkId,
      req.currentUser!.id,
      req.body
    );

    if (!check) throw new Error("Error updating check");

    return response.status(200).json(check);
  } catch (error: any) {
    return response
      .status(500)
      .json({ error: error.message || "Error updating check" });
  }
};
