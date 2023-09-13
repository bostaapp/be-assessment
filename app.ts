import express from "express";
import user from "./routes/user";
import url_check from "./routes/url_check";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = 3000;

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

app.use(express.json());

app.use("/user", user);
app.use("/url_check", url_check);

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

app.listen(port, () => {
  console.log(`Server is running on : http://localhost:${port}`);
});
