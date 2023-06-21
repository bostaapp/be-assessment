import express, { Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import 'express-async-errors';

import { notFoundMiddleware, errorMiddleware, morganMiddleware } from './middlewares';

import * as authAPI from './api/auth.api';

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

app.use('/health', (req: Request, res: Response) => {
  return res.json({ Ok: true });
});

app.use('/api', router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
