import { assertEquals } from "https://deno.land/std@0.142.0/testing/asserts.ts";

import {
  generateShopeeProductImageUrl,
  generateShopeeProductUrl,
} from "../mod.ts";

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
