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

await Promise.all(uniqueKeywords.map(async (uniqueKeyword) => {
  const response = await fetchProductsFromTrends(uniqueKeyword);

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
