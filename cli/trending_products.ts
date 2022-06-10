import { fetchDailyProducts } from "../mod.ts";
import {
  ICreateProductWithImages,
  setupOctokit,
  upload,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");
const octokit = setupOctokit(ghToken);

const rawJson = Deno.args[0];
const uniqueKeywords: string[] = JSON.parse(rawJson);

const response = await fetchDailyProducts(uniqueKeywords);

await upload<ICreateProductWithImages[]>(
  octokit,
  response,
  "WRITE_SHOPEE_PRODUCTS",
);

Deno.exit();
