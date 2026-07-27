import type { PurchaseItemRequest } from "./PurchaseItemRequest";

/**
 * 商品購入情報を表すモデル
 * POST /api/customer/orders のリクエストに対応する型
 */
export interface PurchaseRequest {
  /** 支払い方法ID */
  paymentMethodId: string;

  /** 購入商品一覧 */
  items: PurchaseItemRequest[];
}