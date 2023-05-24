import express, { Request, Response } from "express";
import { userRouter } from "./routes/user-routes";
import { checkRoutes } from "./routes/check-routes";
import { ReportRouter } from "./routes/report-routes";

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/checks", checkRoutes);
app.use("/api/reports", ReportRouter);

app.all("*", async (req: Request, res: Response) => {
  return res.status(404).send("Not found");
});

export { app };
