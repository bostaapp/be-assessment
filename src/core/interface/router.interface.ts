import { IRouter } from "express";

export interface Router {
  getPath(): string;

  getRouter(): IRouter;
}
