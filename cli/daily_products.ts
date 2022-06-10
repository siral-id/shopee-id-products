import { fetchDailyProducts } from "../mod.ts";
import {
  chunkItems,
  ICreateProductWithImages,
  setupOctokit,
  sleep,
  upload,
} from "https://raw.githubusercontent.com/siral-id/core/feat/add-throttlin/mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");

const octokit = setupOctokit(ghToken);

const response = await fetchDailyProducts();

const uploadWithRetry = async <T>(
  data: T,
  retryCount = 0,
  maxRetry = 60,
  lastError?: string,
): Promise<void> => {
  if (retryCount > maxRetry) throw new Error(lastError);
  try {
    await upload<T>(
      octokit,
      data,
      "WRITE_PRODUCTS_SHOPEE",
    );
  } catch (error) {
    await sleep(retryCount);
    await uploadWithRetry(data, retryCount + 1, error);
  }
};

await Promise.all(
  chunkItems(response).map(async (chunk) =>
    await uploadWithRetry<ICreateProductWithImages[]>(chunk)
  ),
);

Deno.exit();
