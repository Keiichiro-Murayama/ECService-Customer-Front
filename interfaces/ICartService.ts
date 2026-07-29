import type { CartItem } from "@/models/CartItem";

/**
 * カート操作Serviceのインターフェース
 */
export interface ICartService {
  /**
   * カート内の商品一覧を取得する
   */
  getItems(): CartItem[];

  /**
   * 商品の数量を変更する
   *
   * @param productUuid 商品UUID
   * @param quantity 変更後の数量
   */
  updateQuantity(
    productUuid: string,
    quantity: number,
  ): CartItem[];

  /**
   * カートから商品を削除する
   *
   * @param productUuid 商品UUID
   */
  removeItem(productUuid: string): CartItem[];

  /**
   * カート内商品の合計金額を計算する
   */
  calculateTotal(items: CartItem[]): number;
}