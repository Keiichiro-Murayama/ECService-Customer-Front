import { injectable } from "inversify";

import type { ICartRepository } from "@/interfaces/ICartRepository";
import type { CartItem } from "@/models/CartItem";

/**
 * sessionStorageに保存するカート情報のキー
 */
const CART_STORAGE_KEY = "ecservice-customer-cart";

/**
 * 値がCartItem形式か確認する
 *
 * @param value 確認対象
 * @returns CartItem形式の場合true
 */
const isCartItem = (value: unknown): value is CartItem => {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.productUuid === "string" &&
    typeof item.productName === "string" &&
    typeof item.price === "number" &&
    typeof item.imageUrl === "string" &&
    typeof item.quantity === "number" &&
    typeof item.stock === "number"
  );
};

/**
 * カート情報をsessionStorageで管理するRepository
 */
@injectable()
export class CartRepository implements ICartRepository {
  /**
   * カート内の商品をすべて取得する
   *
   * @returns カート内の商品一覧
   */
  getItems(): CartItem[] {
    /*
     * Server Component側で実行された場合は
     * sessionStorageを使用できないため空配列を返す
     */
    if (typeof window === "undefined") {
      return [];
    }

    const storedValue =
      window.sessionStorage.getItem(CART_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    try {
      const parsedValue: unknown =
        JSON.parse(storedValue);

      if (!Array.isArray(parsedValue)) {
        window.sessionStorage.removeItem(
          CART_STORAGE_KEY,
        );

        return [];
      }

      const cartItems =
        parsedValue.filter(isCartItem);

      /*
       * 不正なデータが含まれていた場合は
       * 正常なデータだけを保存し直す
       */
      if (cartItems.length !== parsedValue.length) {
        this.saveItems(cartItems);
      }

      return cartItems;
    } catch (cause: unknown) {
      console.error(
        "カート情報の読み込みに失敗しました。",
        cause,
      );

      window.sessionStorage.removeItem(
        CART_STORAGE_KEY,
      );

      return [];
    }
  }

  /**
   * カート内の商品を保存する
   *
   * @param items 保存する商品一覧
   */
  saveItems(items: CartItem[]): void {
    if (typeof window === "undefined") {
      throw new Error(
        "カート情報はブラウザ上でのみ保存できます。",
      );
    }

    window.sessionStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items),
    );

    /*
     * ヘッダーなどへカート件数の変更を通知する
     */
    window.dispatchEvent(
      new CustomEvent("cart-updated", {
        detail: {
          items,
        },
      }),
    );
  }
}