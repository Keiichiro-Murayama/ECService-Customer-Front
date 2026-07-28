/**
 * 商品を表すモデル
 * GET /api/customer/products で取得される商品配列の一つ分の型
 */
export interface Product {
  /** 商品のUUID */
  productUuid: string;

  /** 商品名 */
  productName: string;

  /** 商品価格 */
  price: number;

  /** 商品画像のURL */
  imageUrl: string;
}