/**
 * 購入履歴を表すモデル
 * GET /api/customer/orders で取得される購入履歴配列の一つ分の型
 */
export interface OrderHistory {
  /** 注文ID */
  orderId: number;

  /** 注文UUID */
  orderUuid: string;

  /**
   * 注文日時
   * APIからISO 8601形式の文字列で返される
   */
  orderDate: string;

  /** 注文合計金額 */
  amountTotal: number;
}