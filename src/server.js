import express from 'express';
import morgan from 'morgan';
import router from './router';
import { config as parseEnvironmentVariables } from 'dotenv';

parseEnvironmentVariables();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}


// Mount Router
app.use(router)

app.get("/", (req, res, next) => {
    res.send("Hello, World!")
})


const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});


//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1)); //Take down server
});