import cheerio from "cheerio";
import axios from "axios";

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
