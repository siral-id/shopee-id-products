import { fetchDailyProducts } from "../mod.ts";
import {
  chunkItems,
  ICreateProductWithImages,
  setupOctokit,
  upload,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");
const octokit = setupOctokit(ghToken);

const response = await fetchDailyProducts();

await Promise.all(
  chunkItems(response, 256).map(async (chunk) => {
    await upload<ICreateProductWithImages[]>(
      octokit,
      chunk,
      "WRITE_SHOPEE_PRODUCTS",
    );
  }),
);

Deno.exit();
