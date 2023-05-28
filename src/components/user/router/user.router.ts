import { IRouter } from 'express';
import { AppRouter } from '../../../core/interface/router.interface';
import express = require('express');
import { login, register, verify } from '../controller/user.controller';
import {
  registerValidationMiddleware,
  loginValidationMiddleware,
} from '../../../core/middleware/validation.middleware';

export class UserRouter implements AppRouter {
  getPath(): string {
    return '/users';
  }
  getRouter(): IRouter {
    const router = express.Router();
    router.post('/', registerValidationMiddleware, register);
    router.get('/verify/:token', verify);
    router.post('/login', loginValidationMiddleware, login);
    return router;
  }
}
