import {
  IShopeeProductResponse,
  IShopeeProductSchema,
} from "./interfaces/mod.ts";
import {
  sleep,
} from "https://raw.githubusercontent.com/siral-id/deno-utility/main/utility.ts";
import { getMongoClient } from "https://raw.githubusercontent.com/siral-id/deno-utility/main/database.ts";

const noOfPages = 10;
const sleepDuration = 0.1;

const mongoUri = Deno.env.get("MONGO_URI");
if (!mongoUri) throw new Error("MONGO_URI not found");

const client = await getMongoClient(mongoUri);
const productCollection = client.database().collection<IShopeeProductSchema>(
  "products",
);

const offsets = Array.from(Array(noOfPages).keys());

await Promise.all(offsets.map(async (offset) => {
  const url =
    `https://shopee.co.id/api/v4/recommend/recommend?bundle=daily_discover_main&item_card=${offset}&limit=60&offset=${offset}`;
  const response = await fetch(url);
  const data: IShopeeProductResponse = await response.json();

  const section = data["data"]["sections"][0];
  const products = section["data"]["item"];

  const productsWithSource = products.map((product) => ({
    ...product,
    source: "SHOPEE",
  }));
  await productCollection.insertMany(productsWithSource);

  // prevent hammering the api source
  await sleep(sleepDuration);
}));
