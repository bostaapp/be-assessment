import { Server } from './core/server';
import { UserRouter } from './components/user/router/user.router';
import { dbConnect } from './core/db/mongo.connection';


const app = new Server();

dbConnect();

app.addRouter(new UserRouter());

app.listen(3000);
