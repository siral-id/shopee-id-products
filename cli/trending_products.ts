import { fetchProductsFromTrends } from "../mod.ts";
import {
  chunkItems,
  createGistWithRetry,
  Pipeline,
  setupOctokit,
  uploadWithRetry,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");

const rawData = Deno.args[0];
const uniqueKeywords: string[] = JSON.parse(rawData);
if (!uniqueKeywords) throw new Error("missing keywords arguments");

const index = Number(Deno.args[1]);
if (index === undefined && index === null) {
  throw new Error("missing page index");
}

const octokit = setupOctokit(ghToken);

const products = await fetchProductsFromTrends(
  uniqueKeywords[index],
);

const maxGistSize = 1048576;
const chunks = chunkItems(products, maxGistSize);

const gists = await Promise.all(
  chunks.map(async (chunk) => {
    const { data: { id } } = await createGistWithRetry<string>(
      octokit,
      JSON.stringify(chunk),
    );
    return id;
  }),
);

await uploadWithRetry<string>(
  octokit,
  JSON.stringify(gists),
  Pipeline.ShopeeProducts,
);

Deno.exit();
