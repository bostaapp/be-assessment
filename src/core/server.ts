import express from 'express';
import { AppRouter } from './interface/router.interface';
import { AppMiddleware } from './interface/app.middleware.interface';

export class Server {
  private readonly _server = express();

  constructor() {
    this._server.use(express());
    this._server.use(express.json());

    this._server.get('/', (_req, res) => {
      return res.send({
        data: 'this is the API endpoint',
      });
    });
  }

  addRouter(router: AppRouter) {
    this._server.use(router.getPath(), router.getRouter());
  }

  addMiddleware(middleware: AppMiddleware) {
    this._server.use(middleware.getMiddleware());
  }

  async connectToMongo(connect) {
    await connect();
  }

  listen(port: number | string) {
    this._server.listen(port, () => {
      console.log(`server running ...`);
      console.log(`server listen on port ${port}`);
    });
  }
}
