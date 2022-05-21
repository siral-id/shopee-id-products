import { readJSON, writeJSON } from "https://deno.land/x/flat/mod.ts";
import { IShopeeProductResponse, ITrend } from "../interfaces.ts"

const filename = Deno.args[0]; // Same name as downloaded_filename
const response: IShopeeProductResponse = await readJSON(filename);

if (response["error"] !== 0) {
  console.log("Error", response["error"]);
}

const section = response["data"]["sections"][0];
const currentProducts = section["data"]["item"];

const output = `shopee_products.json`;
const existingProducts = await readJSON(output);

const products = existingProducts.concat(currentProducts)

await writeJSON(output, products);
