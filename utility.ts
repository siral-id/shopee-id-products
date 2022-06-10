import { IShopeeGetProductResponse } from "./mod.ts";

export interface IGenerateShopeeProductUrl {
  name: string;
  itemid: number;
  shopid: number;
}

export interface IGenerateShopeeProductImageUrl {
  image: string;
}

export interface IGetShopeeProductDetail {
  itemid: number;
  shopid: number;
}

export function generateShopeeProductUrl(
  { name, shopid, itemid }: IGenerateShopeeProductUrl,
): string {
  return `https://shopee.co.id/${name}-i.${shopid}.${itemid}`;
}

export function generateShopeeProductImageUrl(
  { image }: IGenerateShopeeProductImageUrl,
): string {
  return `https://cf.shopee.co.id/file/${image}`;
}

export async function getShopeeProductDetail(
  { itemid, shopid }: IGetShopeeProductDetail,
): Promise<IShopeeGetProductResponse> {
  const productUrl =
    `https://shopee.co.id/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`;
  const productResponse = await _utilityInternals.fetch(productUrl);
  return await productResponse.json();
}

export const _utilityInternals = { fetch };
