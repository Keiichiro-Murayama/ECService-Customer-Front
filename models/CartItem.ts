/**
 * カート内の商品を表すモデル
 * 顧客側フロントエンドのカートに保持される商品の一つ分の型
 */
export interface CartItem {
  /** 商品のUUID */
  productUuid: string;

  /** 商品名 */
  productName: string;

  /** 商品価格 */
  price: number;

  /** 商品画像のURL */
  imageUrl: string;

  /** 購入数量 */
  quantity: number;

  /** 商品の在庫数 */
  stock: number;
}