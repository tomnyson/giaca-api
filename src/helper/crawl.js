import cheerio from "cheerio";
import axios from "axios";
import { getCurrentDate } from "./helperGlobal";
import moment from "moment";
import puppeteer from "puppeteer";

export const extractData = async () => {
  const html = await axios.get("https://giacaphe.com/");
  const $ = await cheerio.load(html.data);
  let data = [];
  $("#gianoidia").each((i, elem) => {
    $(elem)
      .find("tr")
      .each((i, item) => {
        if (i > 0) {
          const std = $(item).find("td");
          data.push({
            name: std.eq(0).text().trim(),
            price: std.eq(1).text().trim(),
            change: std.eq(2).text().trim(),
          });
        }
      });
  });
  return data;
};

export const getListDate = async () => {
  const html = await axios.get(
    `https://giacaphe.com/gia-ca-phe-noi-dia-ngay-${getCurrentDate()}`,
  );
  const $ = await cheerio.load(html.data);
  let data = [];
  $("#ngay option").each((i, elem) => {
    const date = $(elem).attr("value");
    data.push(date);
  });
  data.pop();
  return data;
};

export const getPriceByDate = async (date) => {
  const html = await axios.get(
    `https://giacaphe.com/gia-ca-phe-noi-dia-ngay-${date}`,
  );
  const $ = await cheerio.load(html.data);
  let data = [];
  $("#gia_trong_nuoc").each((i, elem) => {
    $(elem)
      .find("tr")
      .each((i, item) => {
        if (i > 1) {
          const std = $(item).find("td");
          data.push({
            name: std.eq(0).text().trim(),
            price: std.eq(1).text().trim().replace(/\D/g, ""),
            change: std.eq(2).text().trim().replace(/\D/g, ""),
          });
        }
      });
  });
  return data;
};

export const getPricePepper = async (date) => {
  const html = await axios.get(
    `https://giatieu.com/category/thi-truong-hat-tieu/`,
  );
  const $ = await cheerio.load(html.data);
  let data = {};
  const prices = [];
  const dateUpdate = $(".title").text();
  const regex = /[\d\/]/g;
  const parseDate = dateUpdate.match(regex).join("");
  data.dateTrack = moment(parseDate, "YYYY/MM/DD");
  $("#giatieu_sidebar").each((i, elem) => {
    $(elem)
      .find("tr")
      .each((i, item) => {
        if (i > 0) {
          const std = $(item).find("td");
          prices.push({
            name: std.eq(0).text().trim(),
            price: std.eq(1).text().trim().replace(/\D/g, ""),
            change: std.eq(2).text().trim().replace(/\D/g, ""),
          });
        }
      });
  });
  prices.pop();
  data.prices = prices;
  return data;
};

export const getPriceGold = async (date) => {
  const html = await axios.get(
    `https://www.24h.com.vn/gia-vang-hom-nay-c425.html?d=${getCurrentDate()}`,
  );
  const $ = await cheerio.load(html.data);
  let data = {};
  const prices = [];
  const dateUpdate = $(".tabTit .fl strong").text();
  const regex = /[\d\/]/g;
  const parseDate = dateUpdate.match(regex).join("");
  data.dateTrack = moment(new Date(parseDate)).utcOffset("+07:00");
  $(".tabBody table").each((i, elem) => {
    $(elem)
      .find("tr")
      .each((i, item) => {
        const std = $(item).find("td");
        const isCreaseBuy = std.eq(1).find("span").hasClass("colorGreen");
        const isCreaseSell = std.eq(2).find("span").hasClass("colorGreen");
        prices.push({
          name: std.eq(0).text().trim(),
          buy: 1 * std.eq(1).find(".fixW").text().trim().replace(/\D/g, ""),
          sell: 1 * std.eq(2).find(".fixW").text().trim().replace(/\D/g, ""),
          buyChange: isCreaseBuy
            ? 1 * std.eq(1).find("span").last().text().replace(/\D/g, "")
            : -1 * std.find("span").last().text().replace(/\D/g, ""),
          sellChange: isCreaseSell
            ? 1 * std.eq(2).find("span").last().text().replace(/\D/g, "")
            : -1 * std.find("span").last().text().replace(/\D/g, ""),
        });
      });
  });
  data.prices = prices;
  return data;
};

export const getPriceCurrency = async (date) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    "https://portal.vietcombank.com.vn/Personal/TG/Pages/ty-gia.aspx?devicechannel=default",
  );
  let content = await page.content();
  const $ = await cheerio.load(content);
  let data = {};
  const prices = [];
  const dateUpdate = $("#txttungay").attr("value");
  data.dateTrack = new Date(dateUpdate);
  $("#ctl00_Content_ExrateView").each((i, elem) => {
    $(elem)
      .find("tr")
      .each((i, item) => {
        if (i > 1) {
          const std = $(item).find("td");
          prices.push({
            name: std.eq(0).text().trim(),
            code: std.eq(1).text().trim(),
            buyCash:
              std.eq(2).text().trim().replace(/[,]/, "") != "-"
                ? std.eq(2).text().trim().replace(/[,]/, "")
                : 0,
            buyTransferPayment:
              std.eq(3).text().trim().replace(/[,]/, "") != "-"
                ? std.eq(3).text().trim().replace(/[,]/, "")
                : 0,
            sell:
              std.eq(4).text().trim().replace(/[,]/, "") != "-"
                ? std.eq(4).text().trim().replace(/[,]/, "")
                : 0,
          });
        }
      });
  });
  data.prices = prices;
  return data;
};

export const getPriceFood = async (type, date = getCurrentDate()) => {
  let path;
  if (type === 1) {
    path = `http://xttm.mard.gov.vn/api/GiaTheGioiTheoNgay?Ngaychon=${date}`;
  }
  if (type === 2) {
    path = `http://xttm.mard.gov.vn/api/GiaTrongNuocTheoNgay?Ngaychon=${date}`;
  }
  console.log("path", path);
  const response = await axios.get(path, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (response.status === 200 && response.data.danhsachgia.length) {
    return {
      dateTrack: date,
      [type === 2 ? "prices" : "prices"]: response.data.danhsachgia,
    };
  }
  return getPriceFood(
    type,
    moment(date).subtract(1, "days").format("YYYY-MM-DD"),
  );
};

export const getPost = async (type = "coffee", currentPage = 1) => {
  let data = [];
  if (type === "coffee") {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
      `https://giacaphe.com/thi-truong-ca-phe/tin-thi-truong-ca-phe/page/${currentPage}`,
    );
    let content = await page.content();
    const $ = await cheerio.load(content);
    $("#topic .topic_item").each((i, elem) => {
      const currentPost = $(elem);
      data.push({
        title: currentPost.find("h3 a").text(),
        slug: currentPost.find("h3 a").attr("href"),
        created: currentPost.find(".font_11_gray").text().split(",")[0],
        image: currentPost.find("img").attr("data-lazy-src"),
        shortDescription: currentPost.find("p").last().text(),
        type,
      });
    });
  }
  if (type === "pepper") {
    const html = await axios.get(
      `https://giatieu.com/category/thi-truong-hat-tieu/`,
    );
    const $ = await cheerio.load(html.data);
    $("#main .topic_item").each((i, elem) => {
      const currentPost = $(elem);
      data.push({
        title: currentPost.find("h2 a").text(),
        slug: currentPost.find("h2 a").attr("href"),
        created: currentPost.find(".gtui_gray").text().split(",")[0],
        shortDescription: currentPost.find(".summary").text(),
        image: currentPost.find("img").attr("src"),
        type,
      });
    });
  }

  if (type === "gold") {
    const html = await axios.get(
      `https://www.24h.com.vn/gia-vang-hom-nay-c425.html`,
    );
    const $ = await cheerio.load(html.data);
    $(".postx .bxDoiSbIt").each((i, elem) => {
      const currentPost = $(elem);
      const checkImg = currentPost.find("span").hasClass("imgFlt");
      if (checkImg) {
        data.push({
          title: currentPost.find(".nwsTit a").text(),
          slug: currentPost.find(".nwsTit a").attr("href"),
          created: currentPost.find(".updTm").text().split("|")[0].trim(),
          shortDescription: currentPost.find(".descd").text(),
          image: currentPost.find("img").attr("data-original"),
          type,
        });
      }
    });
  }
  return data;
};
