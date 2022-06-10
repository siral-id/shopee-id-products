import {
  generateShopeeProductImageUrl,
  generateShopeeProductUrl,
  getShopeeProductDetail,
  IShopeeProductResponse,
  IShopeeSearchResponse,
} from "./mod.ts";
import {
  ICreateProductWithImages,
  sleep,
  Source,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

export async function fetchDailyProducts(
  noOfPages = 10,
  sleepDuration = 0.1,
): Promise<ICreateProductWithImages[]> {
  const offsets = Array.from(Array(noOfPages).keys());
  const serializedProducts: ICreateProductWithImages[] = [];

  await Promise.all(offsets.map(async (offset) => {
    const url =
      `https://shopee.co.id/api/v4/recommend/recommend?bundle=daily_discover_main&item_card=${offset}&limit=60&offset=${offset}`;
    const response = await _postProcessInternals.fetch(url);
    const data: IShopeeProductResponse = await response.json();

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
            view_count,
            stock,
          },
        ) => {
          let { data: { description } } = await getShopeeProductDetail({
            itemid,
            shopid,
          });

          if (!description) description = "";

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

      const response = await _postProcessInternals.fetch(url);
      const data: IShopeeSearchResponse = await response.json();

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
                view_count,
                stock,
              },
            },
          ) => {
            let { data: { description } } = await getShopeeProductDetail({
              itemid,
              shopid,
            });

            if (!description) description = "";

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

export const _postProcessInternals = { fetch };
