import "regenerator-runtime/runtime";
import express from "express";
import { extractData } from "./helper/crawl";
import { setCache, getCacheServer } from "./middeware";
import PriceModel from "./models/price.model";
import PepperModel from "./models/pepper.model";
import FoodModel from "./models/food.model";
import GoldModel from "./models/gold.model";
import CurrencyModel from "./models/currency.model";
import PostModel from "./models/post.model";
import cors from "cors";
import "./helper/mongoProvider";
import { startCronJob } from "./cronJob/cronJob";

require("dotenv").config();

const app = express();
app.use(cors());
const port = process.env.PORT || "8080";

app.get("/", (req, res, nex) => {
  return res.json({ message: "api server runing" });
});

app.get("/price", [getCacheServer], async (req, res, nex) => {
  const data = await extractData();
  return res.json({ data });
});

app.get("/api/v2/coffee", async (req, res, nex) => {
  const lastPrice = await PriceModel.findOne().sort({ dateTrack: -1 });
  return res.json(lastPrice);
});

app.get("/api/v2/pepper", async (req, res, nex) => {
  const lastPrice = await PepperModel.findOne().sort({ dateTrack: -1 });
  return res.json(lastPrice);
});

app.get("/api/v2/food", async (req, res, nex) => {
  const { type = 2 } = req.query;
  let condition = {};
  if (type) {
    condition.type = type;
  }
  console.log("condition", condition);
  const lastPrice = await FoodModel.findOne(condition).sort({
    dateTrack: -1,
  });
  return res.json(lastPrice);
});

app.get("/api/v2/gold", async (req, res, nex) => {
  try {
    const lastPrice = await GoldModel.findOne().sort({
      dateTrack: -1,
    });
    return res.json(lastPrice);
  } catch (error) {
    throw error;
  }
});

app.get("/api/v2/currency", async (req, res, nex) => {
  try {
    const lastPrice = await CurrencyModel.findOne().sort({
      dateTrack: -1,
    });
    return res.json(lastPrice);
  } catch (error) {
    throw error;
  }
});

app.get("/api/v2/food", async (req, res, nex) => {
  try {
    const { type = 2 } = req.query;
    let conditions = {};
    if (type) {
      conditions.type = Number(type);
    }
    const lastPrice = await FoodModel.findOne(conditions).sort({
      dateTrack: -1,
    });
    return res.json(lastPrice);
  } catch (error) {
    throw error;
  }
});

app.get("/api/v2/post", async (req, res, nex) => {
  try {
    const { type = "coffee" } = req.query;
    let conditions = {};
    if (type) {
      conditions.type = type;
    }
    const lastPrice = await PostModel.find(conditions).sort({
      dateTrack: -1,
    });
    return res.json(lastPrice);
  } catch (error) {
    throw error;
  }
});

app.get("/api/report", async (req, res, nex) => {
  try {
    let condition = {};
    const defaultQuery = {
      limit: 30,
    };
    const { start, limit } = { ...defaultQuery, ...req.query };
    if (start) {
      console.log("start", start);
      condition.dateTrack = {
        $gte: new Date(start),
        $lt: Date.now(),
      };
    }
    const listPrice = await PriceModel.find()
      .sort({ dateTrack: -1 })
      .limit(Number(limit));
    return res.json({ message: "ok", listPrice });
  } catch (err) {
    throw err;
  }
});

app.listen(port, () => {
  startCronJob();
  console.log("server is listening at port", port);
});
