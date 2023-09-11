import { Router } from "express";
import { prisma } from "../utils/db";

const router = Router();

router.post("/create", async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({ data: { name, email } });

  res.send(user);
});

export default router;
