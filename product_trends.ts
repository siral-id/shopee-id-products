import {
  sleep,
} from "https://raw.githubusercontent.com/siral-id/deno-utility/main/utility.ts";
import { getMongoClient } from "https://raw.githubusercontent.com/siral-id/deno-utility/main/database.ts";
import {
  ITrendSchema,
} from "https://raw.githubusercontent.com/siral-id/deno-utility/main/interfaces.ts";
import {
  IShopeeProductSchema,
  IShopeeSearchResponse,
} from "./interfaces/mod.ts";

const sleepDuration = 0.1;

const mongoUri = Deno.env.get("MONGO_URI");
if (!mongoUri) throw new Error("MONGO_URI not found");

const client = await getMongoClient(mongoUri);
const trendCollection = client.database().collection<ITrendSchema>("trends");
const productCollection = client.database().collection<IShopeeProductSchema>("products");

const uniqueKeywords: ITrendSchema[] = await trendCollection.distinct("keyword");

await Promise.all(uniqueKeywords.map(async (keyword) => {
  let isThereNextSearch = true;
  let offset = 0;
  const limit = 60;

  while (isThereNextSearch != false) {
    const url =
      `https://shopee.co.id/api/v4/search/search_items?by=relevancy&keyword=${keyword}&limit=${limit}&newest=${offset}&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`;

    const response = await fetch(url);
    const data: IShopeeSearchResponse = await response.json();

    const items = data["items"];
    const productsWithSource = items.map(({ item_basic }) => ({
      ...item_basic, source: "SHOPEE"
    }))
    await productCollection.insertMany(productsWithSource)

    isThereNextSearch = data["nomore"];
    offset += limit;

    await sleep(sleepDuration);
  }
}));
