import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.142.0/testing/asserts.ts";
import {
  assertSpyCalls,
  returnsNext,
  stub,
} from "https://deno.land/std@0.142.0/testing/mock.ts";

import {
  _utilityInternals,
  generateShopeeProductImageUrl,
  generateShopeeProductUrl,
  getShopeeProductDetail,
} from "../mod.ts";
import { SHOPEE_GET_PRODUCT_RESPONSE } from "./mod.ts";
import {
  generateResponse
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

Deno.test("Make sure generateShopeeProductUrl is correct", () => {
  assertEquals(
    generateShopeeProductUrl({ name: "product", shopid: 1, itemid: 1 }),
    "https://shopee.co.id/product-i.1.1",
  );
});

Deno.test("Make sure generateShopeeProductImageUrl is correct", () => {
  assertEquals(
    generateShopeeProductImageUrl({ image: "imageurl" }),
    "https://cf.shopee.co.id/file/imageurl",
  );
});

Deno.test("Make sure getShopeeProductDetail is correct", async () => {
  const stubFetch = stub(
    _utilityInternals,
    "fetch",
    returnsNext([generateResponse(SHOPEE_GET_PRODUCT_RESPONSE)]),
  );

  assertObjectMatch(
    await getShopeeProductDetail({ itemid: 1, shopid: 1 }),
    SHOPEE_GET_PRODUCT_RESPONSE,
  );

  assertSpyCalls(stubFetch, 1);
});
