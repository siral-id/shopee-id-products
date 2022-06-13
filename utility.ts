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
