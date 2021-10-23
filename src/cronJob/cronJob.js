import cron from "node-cron";
import {
  getListDate,
  getPriceByDate,
  getPricePepper,
  getPriceGold,
  getPriceCurrency,
  getPriceFood,
  getPost,
} from "../helper/crawl";
import { sleep } from "../helper/helperGlobal";
import PriceModel from "../models/price.model";
import PepperModel from "../models/pepper.model";
import GoldModel from "../models/gold.model";
import CurrencyModel from "../models/currency.model";
import FoodModel from "../models/food.model";
import PostModel from "../models/post.model";
import { pushMessage } from "../helper/notificationProvider";
import isEmpty from "lodash/isEmpty";
export const crawlerReport = async () => {
  try {
    console.log("call crawlerReport");
    const arrDate = await getListDate();
    const listPice = [];
    for (let i = 0; i < arrDate.length; i++) {
      await sleep(5);
      const currentDate = await getPriceByDate(arrDate[i]);
      currentDate.pop();
      listPice.push({
        dateTrack: arrDate[i],
        prices: currentDate,
      });
    }
    for (const item of listPice) {
      const filter = {
        dateTrack: item.dateTrack,
      };
      if (item && !isEmpty(item.prices)) {
        await PriceModel.findOneAndUpdate(
          filter,
          {
            dateTrack: item.dateTrack,
            coffeeDaklak: item.prices[0].price,
            coffeeDaklakChange: item.prices[0].change,
            coffeeLamDong: item.prices[1].price,
            coffeeLamDongChange: item.prices[1].change,
            coffeeGiaLai: item.prices[2].price,
            coffeeGiaLaiChange: item.prices[2].change,
            coffeeDakNong: item.prices[3].price,
            coffeeDakNongChange: item.prices[3].change,
            hotieu: item.prices[4].price,
            hotieuChange: item.prices[4].change,
            usdVnd: item.prices[5].price,
            usdVndChange: item.prices[5].change,
            createDate: Date.now(),
          },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          },
        );
      }
    }
  } catch (err) {
    throw err;
  }
};

export const crawlerPepper = async () => {
  try {
    console.log("call crawlerPepper");
    const data = await getPricePepper();
    const filter = {
      dateTrack: data.dateTrack,
    };
    await PepperModel.findOneAndUpdate(
      filter,
      {
        ...data,
        createDate: Date.now(),
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const crawlerGold = async () => {
  try {
    console.log("call crawlerGold");
    const data = await getPriceGold();
    console.log("data", data);
    const filter = {
      dateTrack: data.dateTrack,
    };
    await GoldModel.findOneAndUpdate(
      filter,
      {
        ...data,
        createDate: Date.now(),
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const crawlerCurrency = async () => {
  try {
    console.log("call crawlerCurrency");
    const data = await getPriceCurrency();
    console.log("data", data);
    const filter = {
      dateTrack: data.dateTrack,
    };
    await CurrencyModel.findOneAndUpdate(
      filter,
      {
        ...data,
        createDate: Date.now(),
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const crawlerFood = async () => {
  try {
    console.log("call crawlerFood");
    const arrType = [1, 2];

    for (let i = 0; i < arrType.length; i++) {
      const data = await getPriceFood(arrType[i]);
      let payload =
        data &&
        data.prices &&
        data.prices.length > 0 &&
        data.prices.map((item) => {
          return {
            name: item.Mathang,
            provide: item.Tinh,
            price: item.Gia.replace(/\D/g, ""),
            unit: item.Donvi,
          };
        });

      const filter = {
        dateTrack: data.dateTrack,
        type: arrType[i],
      };

      await FoodModel.findOneAndUpdate(
        filter,
        {
          prices: payload,
          type: arrType[i],
          createDate: Date.now(),
        },
        {
          new: true,
          upsert: true, // Make this update into an upsert
        },
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const crawlerPost = async () => {
  try {
    const arrType = ["coffee", "pepper", "gold"];

    for (let i = 0; i < arrType.length; i++) {
      const data = await getPost(arrType[i]);

      for (const item of data) {
        const filter = {
          slug: item.slug,
          type: arrType[i],
        };
        await PostModel.findOneAndUpdate(
          filter,
          {
            ...item,
            dateTrack: data.dateTrack,
            type: arrType[i],
            createDate: Date.now(),
          },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          },
        );
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const schedulerCrawlerPrice = () => {
  cron.schedule("0 */2 * * *", async () => {
    await crawlerReport();
  });
};

const schedulerCrawlerPepper = () => {
  cron.schedule("0 */2 * * *", async () => {
    await crawlerPepper();
  });
};

const schedulerCrawlerGold = () => {
  cron.schedule("0 */2 * * *", async () => {
    await crawlerGold();
  });
};

const schedulerCrawlerCurrency = () => {
  cron.schedule("0 */2 * * *", async () => {
    await crawlerCurrency();
  });
};

const schedulerCrawlerFood = () => {
  cron.schedule("0 */2 * * *", async () => {
    await crawlerFood();
  });
};

const schedulerCrawlerPost = () => {
  cron.schedule("0 */2 * * *", async () => {
    await crawlerPost();
  });
};

const scheduleSendNotification = () => {
  cron.schedule("*/2 * * * *", () => {
    pushMessage();
  });
};
export const startCronJob = () => {
  schedulerCrawlerPrice();
  schedulerCrawlerPepper();
  schedulerCrawlerGold();
  schedulerCrawlerCurrency();
  schedulerCrawlerFood();
  schedulerCrawlerPost();
  scheduleSendNotification();
};
