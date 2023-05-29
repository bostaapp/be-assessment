import { Server } from './core/server';
import { UserRouter } from './components/user/router/user.router';
import { dbConnect } from './core/db/mongo.connection';
import { CheckRouter } from './components/check/router/check.router';


const app = new Server();

dbConnect();

app.addRouter(new UserRouter());
app.addRouter(new CheckRouter());

app.listen(3000);
