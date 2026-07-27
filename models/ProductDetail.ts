/**
 * 商品詳細を表すモデル
 * GET /api/customer/products/{productUuid} で取得される商品の型
 */
export interface ProductDetail {
  /** 商品のUUID */
  productUuid: string;

  /** 商品名 */
  productName: string;

  /** 商品価格 */
  price: number;

  /** 商品画像のURL */
  imageUrl: string;

  /** 在庫数 */
  stock: number;

  /** カテゴリのUUID */
  categoryUuid: string;
}