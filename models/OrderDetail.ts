/**
 * 注文明細を表すモデル
 * GET /api/customer/orders/{orderUuid} で取得される注文明細配列の一つ分の型
 */
export interface OrderDetail {
  /** 商品のUUID */
  productUuid: string;

  /** 商品名 */
  productName: string;

  /** 商品価格 */
  price: number;

  /** 購入数量 */
  quantity: number;
}