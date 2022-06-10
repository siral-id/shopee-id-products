import { pullDailyProducts } from "./mod.ts";
import {
  ICreateProductWithImages,
  setupOctokit,
  upload,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");
const octokit = setupOctokit(ghToken);

const response = await pullDailyProducts();

await upload<ICreateProductWithImages[]>(
  octokit,
  response,
  "WRITE_SHOPEE_PRODUCTS",
);

Deno.exit();
