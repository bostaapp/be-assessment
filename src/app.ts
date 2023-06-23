import express, { Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import 'express-async-errors';

import {
  notFoundMiddleware,
  errorMiddleware,
  morganMiddleware,
  authenticationMiddleware,
  userMiddleware,
} from './middlewares';

import * as authAPI from './api/auth.api';
import * as urlcheckAPI from './api/url-check.api';
import * as reportAPI from './api/report.api';

const app = express();

app.use(morganMiddleware);
app.use(
  cors({
    origin: (origin, callback) => {
      return callback(null, true);
    },
  }),
);
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

const router = express.Router();

router.post('/register', authAPI.register);

// urlcheks
router.post('/urlcheck', [authenticationMiddleware, userMiddleware], urlcheckAPI.create);
router.get('/urlcheck', [authenticationMiddleware, userMiddleware], urlcheckAPI.list);

// reports
router.get('/report', [authenticationMiddleware, userMiddleware], reportAPI.list);

app.use('/health', (req: Request, res: Response) => {
  return res.json({ Ok: true });
});

app.use('/api', router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
