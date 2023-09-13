import { $Enums } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../utils/db";
import { Report, UrlCheckOptions } from "../utils/type";
import { supabase } from "../app";
import schedule from "node-schedule";

const router = Router();

router.put("/", async (req, res) => {
  const { authentication, ...urlCheckOptions } = req.body as UrlCheckOptions;
  if (!urlCheckOptions) {
    return res.status(400).send("Wrong options");
  }

  const { username, password } = authentication ?? {};
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  });

  if (!data?.session || !data?.user || error) {
    return res.status(401).send("Unauthenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: data.user.email },
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const { url } = urlCheckOptions;
  let status: $Enums.UrlStatus = "DOWN";

  try {
    const response = await fetch(url);
    if (response.ok || response.status === 200) {
      status = "UP";
    }
  } catch (error) {
    status = "DOWN";
  }

  const check = await prisma.urlCheck.upsert({
    create: { ...urlCheckOptions, url, User: { connect: { id: user.id } } },
    where: { url_userId: { url, userId: user.id } },
    update: { ...urlCheckOptions },
  });

  const poll = schedule.scheduleJob(
    `*/${urlCheckOptions?.interval ?? 100} * * * * *`,
    async function () {
      let status: $Enums.UrlStatus = "UP";
      let responseTime: number | undefined;

      try {
        const start = Date.now();
        const response = await fetch(url);

        status =
          response.status >= 200 && response.status < 400 ? "UP" : "DOWN";
        responseTime = status ? Date.now() - start : undefined;
      } catch (error) {
        status = "DOWN";
        responseTime = undefined;
      }

      await prisma.urlLog.create({
        data: {
          UrlCheck: { connect: { url_userId: { userId: user.id, url } } },
          status,
          responseTime,
        },
      });
    }
  );

  res.send(check);
});

router.get("/", async (req, res) => {
  const url = req.query.url as string;
  const access_token = req.headers?.access_token as string | undefined;

  const { data, error } = await supabase.auth.getUser(access_token);

  if (!data?.user || error) {
    return res.status(401).send("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: data.user?.email },
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const userId = user.id;

  let currentStatus: $Enums.UrlStatus = "DOWN";
  try {
    const response = await fetch(url);
    currentStatus = response.ok ? "UP" : "DOWN";
  } catch (error) {}

  const [urlLogs, totalUpLogs, totalDownLogs, responseTime] =
    await prisma.$transaction([
      prisma.urlLog.findMany({
        where: { UrlCheck: { url, userId } },
      }),
      prisma.urlLog.count({
        where: { UrlCheck: { userId, url }, status: "UP" },
      }),
      prisma.urlLog.count({
        where: { UrlCheck: { userId, url }, status: "DOWN" },
      }),
      prisma.urlLog.aggregate({
        _avg: { responseTime: true },
        where: { UrlCheck: { userId, url }, status: "UP" },
      }),
    ]);

  const report: Report = {
    status: currentStatus,
    outages: totalDownLogs,
    responseTime: responseTime._avg.responseTime!,
    availability: `${Math.round((totalUpLogs / urlLogs.length) * 100)}%`,
    uptime: totalUpLogs * 10 * 60,
    downtime: totalDownLogs * 10 * 60,
    history: urlLogs,
  };
  res.send(report);
});

export default router;
