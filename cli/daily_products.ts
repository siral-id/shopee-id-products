import { fetchDailyProducts } from "../mod.ts";
import {
  chunkItems,
  ICreateProductWithImages,
  Pipeline,
  setupOctokit,
  uploadWithRetry,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");

const octokit = setupOctokit(ghToken);

const offsets = Array.from(Array(noOfPages).keys());

await Promise.all(offsets.map(async (offset) => {
  const response = await fetchDailyProducts(offset);

  await Promise.all(
    chunkItems(response).map(async (chunk) =>
      await uploadWithRetry<ICreateProductWithImages[]>(
        octokit,
        chunk,
        Pipeline.ShopeeProducts,
      )
    ),
  );
}));

Deno.exit();
