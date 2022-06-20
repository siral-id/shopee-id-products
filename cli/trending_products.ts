import { fetchProductsFromTrends } from "../mod.ts";
import {
  chunkItems,
  ICreateProductWithImages,
  Pipeline,
  setupOctokit,
  uploadWithRetry,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");
const octokit = setupOctokit(ghToken);

const rawJson = Deno.args[0];
const uniqueKeywords: string[] = JSON.parse(rawJson);

const index: string = Deno.args[1];

const uniqueKeyword = uniqueKeywords[Number(index)]

let shouldContinueFetch = true;
let populateProducts: ICreateProductWithImages[] = [];

while (shouldContinueFetch) {
  const { products, isThereNextSearch } = await fetchProductsFromTrends(
    uniqueKeyword,
  );

  populateProducts = [...populateProducts, ...products];
  shouldContinueFetch = isThereNextSearch;
}

for (const chunk of chunkItems(populateProducts)) {
  await uploadWithRetry<ICreateProductWithImages[]>(
    octokit,
    chunk,
    Pipeline.ShopeeProducts,
  );
}

Deno.exit();
