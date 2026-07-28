import type { CartItem } from "@/models/CartItem";
import type { PurchaseResponse } from "@/models/PurchaseResponse";

/**
 * 商品購入Serviceのインターフェース
 */
export interface IPurchaseService {
  /**
   * 商品の購入を確定する
   *
   * @param paymentMethodId 支払い方法ID
   * @param items カート内の商品一覧
   * @returns 購入結果
   */
  purchase(
    paymentMethodId: string,
    items: CartItem[],
  ): Promise<PurchaseResponse>;
}