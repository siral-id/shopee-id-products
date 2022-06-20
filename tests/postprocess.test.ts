import {
  assertSpyCalls,
  returnsNext,
  stub,
} from "https://deno.land/std@0.142.0/testing/mock.ts";
import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.142.0/testing/asserts.ts";

import {
  _internals,
  fetchDailyProducts,
  fetchProductsFromTrends,
  fetchShopeeProductDetail,
} from "../mod.ts";
import {
  SHOPEE_GET_PRODUCT_RECOMMENDATION_RESPONS,
  SHOPEE_GET_PRODUCT_RESPONSE,
  SHOPEE_GET_PRODUCT_SEARCH_RESPONSE,
} from "./mod.ts";
import {
  generateResponse,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

Deno.test("Make sure fetchDailyProducts is correct", async () => {
  const stubFetch = stub(
    _internals,
    "fetch",
    returnsNext([
      generateResponse(SHOPEE_GET_PRODUCT_RECOMMENDATION_RESPONS),
      generateResponse(SHOPEE_GET_PRODUCT_RESPONSE),
    ]),
  );

  const products = await fetchDailyProducts(1);

  assertEquals(products.length, 1)

  assertSpyCalls(stubFetch, 2);

  stubFetch.restore();
});

Deno.test("Make sure fetchProductsFromTrends is correct", async () => {
  const stubFetch = stub(
    _internals,
    "fetch",
    returnsNext([
      generateResponse(SHOPEE_GET_PRODUCT_SEARCH_RESPONSE),
      generateResponse(SHOPEE_GET_PRODUCT_RESPONSE),
    ]),
  );

  const { products } = await fetchProductsFromTrends(
    "keyword",
  );

  assertEquals(products.length, 1)

  assertSpyCalls(stubFetch, 2);

  stubFetch.restore();
});

Deno.test("Make sure fetchShopeeProductDetail is correct", async () => {
  const stubFetch = stub(
    _internals,
    "fetch",
    returnsNext([
      generateResponse(SHOPEE_GET_PRODUCT_RESPONSE),
    ]),
  );

  assertObjectMatch(
    await fetchShopeeProductDetail({ itemid: 1, shopid: 1 }),
    SHOPEE_GET_PRODUCT_RESPONSE,
  );

  assertSpyCalls(stubFetch, 1);
});
