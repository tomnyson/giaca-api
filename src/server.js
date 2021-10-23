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
import isEmpty from "lodash/isEmpty";
import cors from "cors";
import "./helper/mongoProvider";
import {
  startCronJob,
  crawlerReport,
  crawlerPepper,
  crawlerFood,
  crawlerGold,
  crawlerCurrency,
  crawlerPost,
} from "./cronJob/cronJob";

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
  try {
    let lastPrice = await PriceModel.findOne().sort({ dateTrack: -1 });
    if (!lastPrice) {
      await crawlerReport();
      lastPrice = await PriceModel.findOne().sort({ dateTrack: -1 });
    }
    return res.json(lastPrice);
  } catch (error) {
    throw error;
  }
});

app.get("/api/v2/pepper", async (req, res, nex) => {
  let lastPrice = await PepperModel.findOne().sort({ dateTrack: -1 });
  if (!lastPrice) {
    await crawlerPepper();
    lastPrice = await PepperModel.findOne().sort({ dateTrack: -1 });
  }
  return res.json(lastPrice);
});

app.get("/api/v2/gold", async (req, res, nex) => {
  try {
    let lastPrice = await GoldModel.findOne().sort({
      dateTrack: -1,
    });
    if (!lastPrice) {
      await crawlerGold();
      lastPrice = await GoldModel.findOne().sort({
        dateTrack: -1,
      });
    }
    return res.json(lastPrice);
  } catch (error) {
    throw error;
  }
});

app.get("/api/v2/currency", async (req, res, nex) => {
  try {
    let lastPrice = await CurrencyModel.findOne().sort({
      dateTrack: -1,
    });
    if (!lastPrice) {
      await crawlerCurrency();
      lastPrice = await CurrencyModel.findOne().sort({
        dateTrack: -1,
      });
    }
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
    let lastPrice = await FoodModel.findOne(conditions).sort({
      dateTrack: -1,
    });
    if (!lastPrice) {
      await crawlerFood();
      lastPrice = await FoodModel.findOne(conditions).sort({
        dateTrack: -1,
      });
    }
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
    console.log("conditions", conditions);
    let lastPrice = await PostModel.find(conditions).sort({
      dateTrack: -1,
    });
    console.log("lastPrice", lastPrice);
    if (isEmpty(lastPrice)) {
      console.log("call here");
      await crawlerPost();
      lastPrice = await PostModel.find(conditions).sort({
        dateTrack: -1,
      });
    }
    return res.json(lastPrice);
  } catch (error) {
    throw error;
  }
});

app.listen(port, () => {
  startCronJob();
  console.log("server is listening at port", port);
});
