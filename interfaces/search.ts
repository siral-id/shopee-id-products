import { IShopeeProduct } from "./product.ts";

export interface IShopeeSearchProduct {
  item_basic: IShopeeProduct;
  ads_id: number;
  campaignid: number;
  distance?: number;
  match_type: number;
  ads_keyword: string;
  deduction_info: string;
  collection_id?: string;
  display_name?: string;
  campaign_stock?: string;
  json_data: string;
  tracking_info?: string;
  itemid: number;
  shopid: number;
  algo_image?: string;
  fe_flags?: string[];
  item_type: number;
  foody_item?: string;
  search_item_tracking: string;
  personalized_labels?: string[];
  biz_json?: string;
}

export interface IShopeeSearchAdjust {
  count: number;
}

export interface IShopeeSearchQueryRewrite {
  fe_query_write_status: number;
  rewrite_keyword?: string;
  hint_keywords?: string;
  ori_keyword: string;
  ori_total_count: number;
  rewrite_type?: string;
}

export interface IShopeeSearchLowResult {
  triggered: boolean;
  scenarios?: string;
  total_organic_count: number;
  pre_lrp_total_organic_count: number;
}

export interface IShopeeSearchAutoPlay {
  triggered: boolean;
}

export interface IShopeeSearchFoodItemInfo {
  total_count: number;
}

export interface IShopeeSearchResponse {
  bff_meta?: string;
  error?: string;
  error_msg?: string;
  reserved_keyword?: string;
  suggestion_algorithm?: string;
  algorithm: string;
  total_count: number;
  nomore: boolean;
  items: IShopeeSearchProduct[];
  price_adjust?: string;
  adjust?: IShopeeSearchAdjust;
  total_ads_count: number;
  hint_keywords?: string;
  show_disclaimer: boolean;
  json_data: string;
  query_rewrite: IShopeeSearchQueryRewrite;
  disclaimer_infos: string[];
  need_next_search: boolean;
  low_result: IShopeeSearchLowResult;
  food_item_info: IShopeeSearchFoodItemInfo;
  search_tracking: string;
}
