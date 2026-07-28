/**
 * 支払い方法を表すモデル
 * GET /api/customer/payments で取得される支払い方法配列の一つ分の型
 */
export interface PaymentMethod {
  /** 支払い方法ID */
  paymentMethodId: string;

  /** 支払い方法名 */
  paymentMethodName: string;
}
