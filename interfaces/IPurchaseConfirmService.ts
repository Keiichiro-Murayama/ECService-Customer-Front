import type { CartItem } from "@/models/CartItem";
import type { PaymentMethod } from "@/models/PaymentMethod";

/**
 * 購入確認画面の初期表示データ
 */
export type PurchaseConfirmInitialData = {
  /** カート内の商品一覧 */
  items: CartItem[];

  /** 支払い方法一覧 */
  paymentMethods: PaymentMethod[];

  /** 合計数量 */
  totalQuantity: number;

  /** 合計金額 */
  totalPrice: number;
};

/**
 * 購入確認Serviceのインターフェース
 */
export interface IPurchaseConfirmService {
  /**
   * 購入確認画面の初期表示データを取得する
   *
   * @returns カート情報、支払い方法、合計情報
   */
  getInitialData(): Promise<PurchaseConfirmInitialData>;
}