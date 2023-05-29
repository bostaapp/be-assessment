import express, { IRouter } from 'express';
import { AppRouter } from '../../../core/interface/router.interface';
import {
  getReportByCheckId,
  getReportsByUserId,
} from '../controller/report.controller';
import { authMiddleware } from '../../../core/middleware/auth.middleware';

export class ReportRouter implements AppRouter {
  getPath(): string {
    return '/reports';
  }
  getRouter(): IRouter {
    const router = express.Router();
    router.get('/', authMiddleware, getReportsByUserId);
    router.get('/checks/:checkId', authMiddleware, getReportByCheckId);
    return router;
  }
}
