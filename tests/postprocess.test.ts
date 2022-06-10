import chai from "https://cdn.skypack.dev/chai@4.3.4?dts";
import {
  assertSpyCalls,
  returnsNext,
  stub,
} from "https://deno.land/std@0.142.0/testing/mock.ts";

import {
  _postProcessInternals,
  _utilityInternals,
  fetchDailyProducts,
  fetchProductsFromTrends,
} from "../mod.ts";
import {
  generateResponse,
  SHOPEE_GET_PRODUCT_RECOMMENDATION_RESPONS,
  SHOPEE_GET_PRODUCT_RESPONSE,
  SHOPEE_GET_PRODUCT_SEARCH_RESPONSE,
} from "./mod.ts";

Deno.test("Make sure fetchDailyProducts is correct", async () => {
  const expect = chai.expect;

  const stubPostprocessFetch = stub(
    _postProcessInternals,
    "fetch",
    returnsNext([
      generateResponse(SHOPEE_GET_PRODUCT_RECOMMENDATION_RESPONS),
    ]),
  );

  const stubUtilityFetch = stub(
    _utilityInternals,
    "fetch",
    returnsNext([
      generateResponse(SHOPEE_GET_PRODUCT_RESPONSE),
    ]),
  );

  const response = await fetchDailyProducts(1);

  expect(response[0]).to.have.property("externalId");

  assertSpyCalls(stubPostprocessFetch, 1);
  assertSpyCalls(stubUtilityFetch, 1);

  stubPostprocessFetch.restore();
  stubUtilityFetch.restore();
});

Deno.test("Make sure fetchProductsFromTrends is correct", async () => {
  const expect = chai.expect;

  const stubPostprocessFetch = stub(
    _postProcessInternals,
    "fetch",
    returnsNext([
      generateResponse(SHOPEE_GET_PRODUCT_SEARCH_RESPONSE),
    ]),
  );

  const stubUtilityFetch = stub(
    _utilityInternals,
    "fetch",
    returnsNext([
      generateResponse(SHOPEE_GET_PRODUCT_RESPONSE),
    ]),
  );

  const response = await fetchProductsFromTrends(["keyword"]);

  expect(response[0]).to.have.property("externalId");

  assertSpyCalls(stubPostprocessFetch, 1);
  assertSpyCalls(stubUtilityFetch, 1);

  stubPostprocessFetch.restore();
  stubUtilityFetch.restore();
});
