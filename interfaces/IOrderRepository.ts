import type { OrderDetail } from "@/models/OrderDetail";
import type { OrderHistory } from "@/models/OrderHistory";
import type { PurchaseRequest } from "@/models/PurchaseRequest";
import type { PurchaseResponse } from "@/models/PurchaseResponse";

/**
 * 注文Repositoryのインターフェイス
 */
export interface IOrderRepository {
  /**
   * 商品の購入を確定する
   * @param purchaseRequest 商品購入情報
   * @returns 商品購入結果
   */
  purchase(
    purchaseRequest: PurchaseRequest
  ): Promise<PurchaseResponse>;

  /**
   * ログイン中の顧客の購入履歴一覧を取得する
   * @returns 購入履歴一覧
   */
  getOrderHistories(): Promise<OrderHistory[]>;

  /**
   * 指定した注文の購入履歴詳細を取得する
   * @param orderUuid 注文UUID
   * @returns 注文明細一覧
   */
  getOrderDetails(
    orderUuid: string
  ): Promise<OrderDetail[]>;
}
