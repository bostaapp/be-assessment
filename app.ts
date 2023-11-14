import express from "express";
import authMiddleware from "./middleware/authMiddleware";
import userRouter from "./routes/userRouter";
import urlCheckRouter from "./routes/urlCheckRouter";

const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/url_check", authMiddleware.authenticateUser, urlCheckRouter);

app.get("/", async (req, res) => {
	res.send("Hello from server");
});

export default app;
