/**
 * 購入商品を表すモデル
 * POST /api/customer/orders の items 配列の一つ分の型
 */
export interface PurchaseItemRequest {
  /** 商品のUUID */
  productUuid: string;

  /** 購入数量 */
  quantity: number;
}