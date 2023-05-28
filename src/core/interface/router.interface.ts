import { IRouter } from "express";

export interface AppRouter {
  getPath(): string;

  getRouter(): IRouter;
}
