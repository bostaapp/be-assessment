import { Router } from "express";
import { prisma } from "../utils/db";
import { supabase } from "../app";

const router = Router();

router.get("/current", async (req, res) => {
  const { access_token } = req.body;
  console.log(access_token);
  const x = await supabase.auth.getUser(access_token);
  console.log(x);
  res.send("Done");
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  const user = await prisma.user.create({ data: { email } });

  if (error) {
    return res.status(401).send();
  }

  res.send(user);
});

export default router;
