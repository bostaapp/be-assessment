import EventEmitter from 'events'

import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan'
import cookieParser from 'cookie-parser';

import indexRouter from './routes/index.js';
import headersAndOptionsRequest from './middlewares/headers-and-options-request.js';
import errorHandler from './middlewares/error-handler.js';
import registerAllListeners from './listeners/subscriber.js';

dotenv.config();

const app = express();

mongoose.connect(
    process.env.MONGO_URI
    , {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(()=>{
    console.log('connected successfully to db')
}).catch(err=>{
      console.log('db connection error: ', '\n', err)
});

app.use(cors())

app.use(headersAndOptionsRequest);

//logger middleware
app.use(morgan("dev"));

//parse the request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.json())

// all routes/methods
app.use('/', indexRouter);

// 404 error
app.use((req, res, next) => {
    const error = {
        _message: "not found",
        message: "not found",
        status: 404
    }
    next(error);
});

// error handler
app.use(errorHandler);


const port = process.env.PORT || 8007;
app.listen( port, ()=>{console.log(`server listening on port ${port}`)});

export const eventEmitter = new EventEmitter();
registerAllListeners(eventEmitter);

export default app;