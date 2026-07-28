import type { OrderHistory } from "@/models/OrderHistory";

/**
 * 購入履歴一覧取得Serviceのインターフェイス
 */
export interface IGetOrderHistoriesService {

  /**
   * ログイン中の顧客の購入履歴一覧を取得する
   *
   * 注文日時の新しい順で購入履歴一覧を取得する。
   *
   * @returns 購入履歴一覧
   */
  getOrderHistories(): Promise<OrderHistory[]>;
}