import { Server } from './core/server';
import { UserRouter } from './components/user/router/user.router';
import { dbConnect } from './core/db/mongo.connection';
import { CheckRouter } from './components/check/router/check.router';
import { ReportRouter } from './components/report/router/report.router';
import { config } from 'dotenv';

config();
const app = new Server();

dbConnect();
/**
 * adding app routers
 */
app.addRouter(new UserRouter());
app.addRouter(new CheckRouter());
app.addRouter(new ReportRouter());

app.listen(process.env.PORT);
