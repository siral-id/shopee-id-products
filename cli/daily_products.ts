import { fetchDailyProducts } from "../mod.ts";
import {
  chunkItems,
  ICreateProductWithImages,
  Pipeline,
  setupOctokit,
  uploadWithRetry,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

const offset = Deno.args[0]
const ghToken = Deno.env.get("GH_TOKEN");

const octokit = setupOctokit(ghToken);

const response = await fetchDailyProducts(offset);

for (const chunk of chunkItems(response)) {
  await uploadWithRetry<ICreateProductWithImages[]>(
    octokit,
    chunk,
    Pipeline.ShopeeProducts,
  );
}

Deno.exit();
