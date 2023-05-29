import express, { IRouter } from 'express';
import { AppRouter } from '../../../core/interface/router.interface';
import {
  createCheck,
  deleteCheck,
  getCheck,
  getChecks,
  updateCheck,
} from '../controller/check.controller';
import { authMiddleware } from '../../../core/middleware/auth.middleware';
import {
  createCheckValidationMiddleware,
  updateCheckValidationMiddleware,
} from '../../../core/middleware/validation.middleware';

export class CheckRouter implements AppRouter {
  getPath(): string {
    return '/checks';
  }
  getRouter(): IRouter {
    const router = express.Router();
    router.post(
      '/',
      authMiddleware,
      createCheckValidationMiddleware,
      createCheck
    );
    router.get('/', authMiddleware, getChecks);
    router.get('/:id', authMiddleware, getCheck);
    router.patch(
      '/:id',
      authMiddleware,
      updateCheckValidationMiddleware,
      updateCheck
    );
    router.delete('/:id', authMiddleware, deleteCheck);
    return router;
  }
}
