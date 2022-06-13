import {
  generateShopeeProductImageUrl,
  generateShopeeProductUrl,
  IGetShopeeProductDetail,
  IShopeeGetProductResponse,
  IShopeeProductResponse,
  IShopeeSearchResponse,
} from "./mod.ts";
import {
  ICreateProductWithImages,
  sleep,
  Source,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

const fetchWithRetry = async <T>(
  url: string,
  requestOptions?: RequestInit,
  retryCount = 0,
  maxRetry = 60,
  lastError?: string,
): Promise<T> => {
  if (retryCount > maxRetry) throw new Error(lastError);
  try {
    const response = await _internals.fetch(
      url,
      requestOptions,
    );
    return response.json();
  } catch (error) {
    console.error(error);
    await sleep(retryCount);
    return fetchWithRetry(url, requestOptions, retryCount + 1, error);
  }
};

export function fetchShopeeProductDetail(
  { itemid, shopid }: IGetShopeeProductDetail,
): Promise<IShopeeGetProductResponse> {
  const productUrl =
    `https://shopee.co.id/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`;
  return fetchWithRetry<IShopeeGetProductResponse>(productUrl);
}

export async function fetchDailyProducts(
  noOfPages = 10,
): Promise<ICreateProductWithImages[]> {
  const offsets = Array.from(Array(noOfPages).keys());
  const serializedProducts: ICreateProductWithImages[] = [];

  await Promise.all(offsets.map(async (offset) => {
    const url =
      `https://shopee.co.id/api/v4/recommend/recommend?bundle=daily_discover_main&item_card=${offset}&limit=60&offset=${offset}`;
    const data = await fetchWithRetry<IShopeeProductResponse>(url);

    const section = data["data"]["sections"][0];
    const products = section["data"]["item"];

    await Promise.all(
      products.map(
        async (
          {
            itemid,
            name,
            shopid,
            raw_discount,
            price,
            images,
            item_rating: { rating_star, rating_count },
            historical_sold,
            sold,
            stock,
          },
        ) => {
          const { data } = await fetchShopeeProductDetail({
            itemid,
            shopid,
          });
          console.log(data);
          let { description, view_count } = data;

          if (!description) description = "";
          if (!view_count) view_count = 0;

          const nameWithDash = name.replace(" ", "-");
          const url = generateShopeeProductUrl({
            name: nameWithDash,
            shopid,
            itemid,
          });
          const shopeeImages = images.map((image) =>
            generateShopeeProductImageUrl({ image })
          );

          serializedProducts.push({
            externalId: itemid.toString(),
            name,
            description,
            source: Source.SHOPEE,
            url,
            discount: raw_discount,
            price,
            ratingAverage: rating_star,
            ratingCount: rating_count[0],
            images: shopeeImages,
            sold: historical_sold + sold,
            view: view_count,
            stock,
          });
        },
      ),
    );
  }));
  return serializedProducts;
}

export async function fetchProductsFromTrends(
  uniqueKeywords: string[],
  limit = 60,
  sleepDuration = 0.1,
): Promise<ICreateProductWithImages[]> {
  const products: ICreateProductWithImages[] = [];
  await Promise.all(uniqueKeywords.map(async (keyword) => {
    let isThereNextSearch = true;
    let offset = 0;

    while (isThereNextSearch != false) {
      const url =
        `https://shopee.co.id/api/v4/search/search_items?by=relevancy&keyword=${keyword}&limit=${limit}&newest=${offset}&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`;

      const data = await fetchWithRetry<IShopeeSearchResponse>(url);
      const items = data["items"];

      await Promise.all(
        items.map(
          async (
            {
              item_basic: {
                itemid,
                name,
                shopid,
                raw_discount,
                price,
                images,
                item_rating: { rating_star, rating_count },
                historical_sold,
                sold,
                stock,
              },
            },
          ) => {
            let { data: { description, view_count } } =
              await fetchShopeeProductDetail({
                itemid,
                shopid,
              });

            if (!description) description = "";
            if (!view_count) view_count = 0;

            // prevent hammering the api source
            await sleep(sleepDuration);

            const nameWithDash = name.replace(" ", "-");
            const url = generateShopeeProductUrl({
              name: nameWithDash,
              shopid,
              itemid,
            });
            const shopeeImages = images.map((image) =>
              generateShopeeProductImageUrl({ image })
            );

            products.push({
              externalId: itemid.toString(),
              name,
              description,
              source: Source.SHOPEE,
              url,
              discount: raw_discount,
              price,
              ratingAverage: rating_star,
              ratingCount: rating_count[0],
              images: shopeeImages,
              sold: historical_sold + sold,
              view: view_count,
              stock,
            });
          },
        ),
      );

      isThereNextSearch = data["nomore"];
      offset += limit;

      await sleep(sleepDuration);
    }
  }));
  return products;
}

export const _internals = { fetch };
