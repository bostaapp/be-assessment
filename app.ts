import express from "express";
import { prisma } from "./utils/db";
import { $Enums } from "@prisma/client";
import user from "./controllers/user";
import { Report } from "./utils/type";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/user", user);

app.post("/log", async (req, res) => {
  const { url } = req.body;
  const userId = 1;
  let status: $Enums.UrlStatus = "UP";
  let responseTime: number | undefined;

  try {
    const start = Date.now();
    const response = await fetch(url);

    status = response.ok ? "UP" : "DOWN";
    responseTime = status ? Date.now() - start : undefined;
  } catch (error) {
    status = "DOWN";
    responseTime = undefined;
  }

  const log = await prisma.urlLog.create({
    data: {
      UrlReport: { connect: { url_userId: { userId, url } } },
      status,
      responseTime,
    },
  });

  res.send(log);
});

app.get("/", async (req, res) => {
  try {
    setInterval(async () => {
      await fetch("http://www.whoscored.com/");
      console.log("Success");
    }, 2000);
  } catch (error) {
    console.log(error);
  }

  res.send("Hello World");
});

app.put("/upsert_check", async (req, res) => {
  const userId = 1;
  const { url } = req.body;
  let status: $Enums.UrlStatus = "DOWN";

  try {
    const response = await fetch(url);
    if (response.ok || response.status === 200) {
      status = "UP";
    }
  } catch (error) {
    status = "DOWN";
  }

  const check = await prisma.urlReport.upsert({
    create: { url, status, User: { connect: { id: userId } } },
    where: { url_userId: { url, userId } },
    update: { url, status },
  });

  res.send(check);
});

app.get("/check_report", async (req, res) => {
  const userId = 1;
  const url = req.query.url as string;

  let currentStatus: $Enums.UrlStatus = "DOWN";
  try {
    const response = await fetch(url);
    currentStatus = response.ok ? "UP" : "DOWN";
  } catch (error) {}

  const [urlLogs, totalUpLogs, totalDownLogs, responseTime] =
    await prisma.$transaction([
      prisma.urlLog.findMany({
        where: { UrlReport: { url, userId } },
      }),
      prisma.urlLog.count({
        where: { UrlReport: { userId, url }, status: "UP" },
      }),
      prisma.urlLog.count({
        where: { UrlReport: { userId, url }, status: "DOWN" },
      }),
      prisma.urlLog.aggregate({
        _avg: { responseTime: true },
        where: { UrlReport: { userId, url }, status: "UP" },
      }),
    ]);

  const report: Report = {
    status: currentStatus,
    outages: totalDownLogs,
    responseTime: responseTime._avg.responseTime!,
    availability: `${(totalUpLogs / urlLogs.length) * 100}%`,
    uptime: totalUpLogs * 10 * 60,
    downtime: totalDownLogs * 10 * 60,
    history: urlLogs,
  };
  res.send(report);
});

app.listen(port, () => {
  console.log(`Server is running on : http://localhost:${port}`);
});
