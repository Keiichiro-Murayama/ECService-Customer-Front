/**
 * 商品購入結果を表すモデル
 * POST /api/customer/orders で返されるレスポンスの型
 */
export interface PurchaseResponse {
  /** 登録された注文のUUID */
  orderUuid: string;

  /** 購入結果のメッセージ */
  message: string;
}