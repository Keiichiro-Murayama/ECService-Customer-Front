import type { PaymentMethod } from "@/models/PaymentMethod";

/**
 * 支払い方法Repositoryのインターフェイス
 */
export interface IPaymentMethodRepository {
  /**
   * 支払い方法一覧を取得する
   * @returns 支払い方法一覧
   */
  getAllPaymentMethods(): Promise<PaymentMethod[]>;
}
