import { IShopeeProduct, IShopeeProductResponse } from "./interfaces.ts";
import {
  appendJSON,
  sleep,
} from "https://raw.githubusercontent.com/siral-id/deno-utility/main/utility.ts";

const noOfPages = 10;
const sleepDuration = 1;
const filepath = "shopee_products.json";

const offsets = Array.from(Array(noOfPages).keys());

await Promise.all(offsets.map(async (offset) => {
  const url =
    `https://shopee.co.id/api/v4/recommend/recommend?bundle=daily_discover_main&item_card=3&limit=60&offset=${offset}`;
  const response = await fetch(url);
  const data: IShopeeProductResponse = await response.json();

  const section = data["data"]["sections"][0];
  const products = section["data"]["item"];

  // prevent hammering the api source
  await sleep(sleepDuration);
  await appendJSON<IShopeeProduct>(filepath, products);
}));
