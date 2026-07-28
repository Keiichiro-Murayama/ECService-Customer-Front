import type { OrderDetail } from "@/models/OrderDetail";

/**
 * 注文詳細取得Serviceのインターフェイス
 */
export interface IGetOrderDetailsService {

  /**
   * 指定した注文の購入履歴詳細を取得する
   *
   * 注文UUIDに対応する商品の明細一覧を取得する。
   *
   * @param orderUuid 注文UUID
   * @returns 注文明細一覧
   */
  getOrderDetails(
    orderUuid: string
  ): Promise<OrderDetail[]>;
}