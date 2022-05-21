export interface IShopeeProductCategory {
  display_name: string;
  catid: number;
  image?: string;
  no_sub: boolean;
  is_default_subcat: boolean;
  block_buyer_platform?: string;
}

export interface IShopeeProductPurchaseLimit {
  order_max_purchase_limit: number;
  item_overall_quota?: number;
  overall_purchase_limit?: number;
  end_date?: string;
  start_date?: string;
}

export interface IShopeeProductItemRating {
  rating_star: number;
  rating_count: number[];
}

export interface IShopeeProductAttribute {
  is_pending_qc: boolean;
  idx: number;
  value: string;
  id: number;
  is_timestamp: boolean;
  name: string;
}

export interface IShopeeCoinEarnItem {
  itemid?: string;
  modleid?: string;
  coin_earn: number;
}

export interface IShopeeProductCoinInfo {
  spend_cash_unit: number;
  coin_earn_items: IShopeeCoinEarnItem[];
}

export interface IShopeeStockBreakdown {
  available_stock: number;
  fulfilment_type: number;
  location_id: string;
  address_id: string;
}

export interface IShopeeTierVariation {
  images: string[];
  properties: string[];
  type: number;
  name: string;
  options: string[];
}

export interface IShopeePriceStock {
  model_id: number;
  stockout_item: number;
  region: string;
  rebate: number;
  price: number;
  promotion_type: number;
  allocated_stock: number;
  shop_id: number;
  end_item: number;
  stock_breakdown_by_location: IShopeeStockBreakdown[];
  item_id: number;
  promotion_id: number;
  purchase_limit: number;
  start_time: number;
  stock: number;
}

export interface IShopeeProductModel {
  itemid: number;
  status: number;
  current_promotion_reserved_stock: number;
  name: string;
  promotionid: number;
  price: number;
  price_stocks: IShopeePriceStock[];
}

export interface IShopeeProduct {
  itemid: number;
  price_max_before_discount: number;
  item_status: number;
  can_use_wholesale: number;
  brand_id: number;
  show_free_shipping: boolean;
  estimated_days?: boolean;
  is_host_sales?: boolean;
  is_slash_price_item?: boolean;
  upcoming_flash_sale?: boolean;
  slash_lowest_price?: boolean;
  is_partial_fulfilled?: boolean;
  condition: number;
  show_original_guarantee: boolean;
  add_on_deal_info: boolean;
  is_non_cc_installment_payment_eligible: boolean;
  categories: IShopeeProductCategory[];
  ctime: number;
  name: string;
  show_shopee_verified_label: boolean;
  userid?: number;
  size_chart: string;
  is_pre_order: boolean;
  service_by_shopee_flag?: boolean;
  historical_sold: number;
  reference_item_id: string;
  recommendation_info?: string;
  bundle_deal_info?: string;
  bundle_deal_id: number;
  has_lowest_price_guarantee: boolean;
  shipping_icon_type: number;
  overall_purchase_limit: IShopeeProductPurchaseLimit;
  images: string[];
  price_before_discount: number;
  cod_flag: number;
  catid: number;
  is_official_shop: number;
  is_mart: number;
  coin_earn_label?: string[];
  hashtag_list?: string[];
  sold: number;
  makeup?: string[];
  item_rating: IShopeeProductItemRating;
  show_official_shop_label_in_title: boolean;
  discount: string;
  reason?: string;
  label_ids: number[];
  has_group_buy_stock: boolean;
  other_stock: number;
  deep_discount?: string;
  attributes: IShopeeProductAttribute;
  pack_size?: string;
  last_active_time?: string;
  badge_icon_type: number;
  liked: boolean;
  is_on_flash_sale?: boolean;
  cmt_count: number;
  is_live_streaming_price?: boolean;
  image: string;
  recommendation_algorithm?: string;
  is_cc_installment_payment_eligible?: boolean;
  shopid: number;
  normal_stock: number;
  video_info_list: string[];
  installment_plans?: string[];
  view_count: number;
  voucher_info?: string;
  current_promotion_has_reserve_stock: boolean;
  liked_count: number;
  show_official_shop_label: boolean;
  price_min_before_discount: boolean;
  show_discount: boolean;
  preview_info?: string;
  flag: number;
  exclusive_price_info?: string;
  current_promotion_reserved_stock: number;
  wholesale_tier_list: string[];
  group_buy_info: string[];
  shopee_verified: boolean;
  item_has_post: boolean;
  hidden_price_display: boolean;
  transparent_background_image: string;
  welcome_package_info: string[];
  discount_stock: number;
  coin_info: number;
  is_adult: boolean;
  currency: string;
  raw_discount: number;
  is_preferred_plus_seller: boolean;
  is_category_failed: boolean;
  price_min: number;
  can_use_bundle_deal: boolean;
  cb_option: number;
  brand: string;
  stock: number;
  status: number;
  price_max: number;
  spl_info?: string;
  is_group_buy_item?: string;
  description?: string;
  flash_sale?: string;
  models: IShopeeProductModel[];
  has_low_fulfillment_rate: boolean;
  price: number;
  shop_location: string;
  tier_variations: IShopeeTierVariation[];
  min_purchase_limit: number;
  can_use_cod?: boolean;
  makeups: string[];
  welcome_package_type: number;
  show_official_shop_label_in_normal_position?: boolean;
  is_alcohol_product: boolean;
  item_type: number;
  spl_installment_tenure?: number;
  show_recycling_info: boolean;
}

export interface IShopeeProductDataSectionIndex {
  data_type: string;
  key: string;
  filtered?: string;
  filtered_dunit?: string;
}

export interface IShopeeProductDataSectionDataTopProduct {
  info: string;
  count: number;
  data_type: string;
  name: string;
  label: string;
  key: string;
  images: string[];
  list?: string[];
}

export interface IShopeeProductDataSectionData {
  item: IShopeeProduct[];
  keyword: string[];
  ads?: string;
  top_product: IShopeeProductDataSectionDataTopProduct[];
  collection?: string;
  item_lite?: string;
  video?: string;
  voucher?: string;
  voucher_detail?: string;
  l1cat?: string;
  collection_lite?: string;
  l2cat?: string;
  shop?: string;
  shop_lite?: string;
  shopcat?: string;
  feed?: string;
  feed_tab?: string;
  stream?: string;
  promotion?: string;
  knode?: string;
  food_item?: string;
}

export interface IShopeeProductDataSection {
  total: number;
  key: string;
  index: IShopeeProductDataSectionIndex[];
  data: IShopeeProductDataSectionData;
  item_card_type: string;
}

export interface IShopeeProductData {
  update_time: number;
  version: string;
  sections: IShopeeProductDataSection[];
  expire: number;
  tab_meta_data?: string;
  misc_info?: string;
}

export interface IShopeeProductResponse {
  bff_meta?: string;
  error: number;
  error_msg?: string;
  data: IShopeeProductData;
}

export interface ITrend {
  keyword: string;
  image: string;
  count: number;
  source: string;
  timestamp: string;
}
