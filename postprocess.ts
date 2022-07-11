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
  maxRetry = 15,
  lastError?: string,
): Promise<T> => {
  console.log(`current retry: ${retryCount} & max retry: ${maxRetry}`);

  if (retryCount === maxRetry) throw new Error(lastError);

  try {
    const response = await _internals.fetch(
      url,
      requestOptions,
    );
    return response.json();
  } catch (error) {
    console.error(error);
    await sleep(retryCount);
    return await fetchWithRetry(
      url,
      requestOptions,
      retryCount + 1,
      maxRetry,
      error,
    );
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
  page: number,
): Promise<ICreateProductWithImages[]> {
  const url =
    `https://shopee.co.id/api/v4/recommend/recommend?bundle=daily_discover_main&item_card=3&limit=60&offset=${page}`;
  const data = await fetchWithRetry<IShopeeProductResponse>(url);

  const section = data["data"]["sections"][0];
  const products = section["data"]["item"];

  return await Promise.all(
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

        return {
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
        };
      },
    ),
  );
}

export async function fetchProductsFromTrends(
  keyword: string,
  offset = 0,
  limit = 60,
): Promise<ICreateProductWithImages[]> {
  const url =
    `https://shopee.co.id/api/v4/search/search_items?by=relevancy&keyword=${keyword}&limit=${limit}&newest=${offset}&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`;

  const serializedProducts: ICreateProductWithImages[] = [];

  const { items, nomore } = await fetchWithRetry<
    IShopeeSearchResponse
  >(url);

  let isThereNextSearch = true;

  while (isThereNextSearch != false) {
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
    isThereNextSearch = nomore;
  }

  return serializedProducts;
}

export const _internals = { fetch };
