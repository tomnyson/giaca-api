import "regenerator-runtime/runtime";
import express from "express";
import { extractData } from "./helper/crawl";
import { setCache, getCacheServer } from "./middeware";
import cors from "cors";

const app = express();
app.use(cors());
const port = process.env.PORT || "8080";

app.get("/", (req, res, nex) => {
  return res.json({ message: "api server runing" });
});

app.get("/price", [getCacheServer], async (req, res, nex) => {
  const data = await extractData();
  setCache("price", data);
  return res.json({ data });
});

app.listen(port, () => {
  console.log("server is listening at port", port);
});
