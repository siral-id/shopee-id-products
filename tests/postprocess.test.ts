import chai from "https://cdn.skypack.dev/chai@4.3.4?dts";
import {
  assertSpyCalls,
  returnsNext,
  stub,
} from "https://deno.land/std@0.142.0/testing/mock.ts";
import {
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
  const expect = chai.expect;

  const stubFetch = stub(
    _internals,
    "fetch",
    returnsNext([
      generateResponse(SHOPEE_GET_PRODUCT_RECOMMENDATION_RESPONS),
      generateResponse(SHOPEE_GET_PRODUCT_RESPONSE),
    ]),
  );

  const result = await fetchDailyProducts(1);

  expect(result[0]).to.have.property("externalId");
  expect(result[0]).to.have.property("name");
  expect(result[0]).to.have.property("url");
  expect(result[0]).to.have.property("price");
  expect(result[0]).to.have.property("ratingAverage");
  expect(result[0]).to.have.property("ratingCount");
  expect(result[0]).to.have.property("discount");
  expect(result[0]).to.have.property("description");
  expect(result[0]).to.have.property("sold");
  expect(result[0]).to.have.property("stock");
  expect(result[0]).to.have.property("view");
  expect(result[0]).to.have.property("source");
  expect(result[0]).to.have.property("images");

  assertSpyCalls(stubFetch, 2);

  stubFetch.restore();
});

Deno.test("Make sure fetchProductsFromTrends is correct", async () => {
  const expect = chai.expect;

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

  expect(products[0]).to.have.property("externalId");
  expect(products[0]).to.have.property("name");
  expect(products[0]).to.have.property("url");
  expect(products[0]).to.have.property("price");
  expect(products[0]).to.have.property("ratingAverage");
  expect(products[0]).to.have.property("ratingCount");
  expect(products[0]).to.have.property("discount");
  expect(products[0]).to.have.property("description");
  expect(products[0]).to.have.property("sold");
  expect(products[0]).to.have.property("stock");
  expect(products[0]).to.have.property("view");
  expect(products[0]).to.have.property("source");
  expect(products[0]).to.have.property("images");

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
