import type { CartItem } from "@/models/CartItem";

/**
 * カート情報を管理するRepositoryのインターフェース
 */
export interface ICartRepository {
  /**
   * カート内の商品をすべて取得する
   *
   * @returns カート内の商品一覧
   */
  getItems(): CartItem[];

  /**
   * カート内の商品を保存する
   *
   * @param items 保存する商品一覧
   */
  saveItems(items: CartItem[]): void;
}