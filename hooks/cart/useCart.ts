"use client";

import { useEffect, useMemo, useState } from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { ICartService } from "@/interfaces/ICartService";
import type { CartItem } from "@/models/CartItem";

/**
 * カートServiceをDIコンテナから取得する
 */
const cartService = container.get<ICartService>(
  TYPES.ICartService,
);

/**
 * 不明な例外からエラーメッセージを取得する
 *
 * @param cause 発生した例外
 * @returns エラーメッセージ
 */
const getErrorMessage = (cause: unknown): string => {
  if (cause instanceof Error) {
    return cause.message;
  }

  return "カートの操作に失敗しました。";
};

/**
 * カート画面の状態と処理を管理するカスタムフック
 */
export const useCart = () => {
  /** カート内の商品一覧 */
  const [items, setItems] = useState<CartItem[]>([]);

  /** 初期データ取得中かどうか */
  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  /** エラーメッセージ */
  const [error, setError] =
    useState<string | null>(null);

  /**
   * カート内商品の合計金額
   */
  const totalPrice = useMemo(() => {
    return cartService.calculateTotal(items);
  }, [items]);

  /**
   * カート内商品の合計数量
   */
  const totalQuantity = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }, [items]);

  /**
   * sessionStorageからカート情報を取得する
   */
  useEffect(() => {
    const initialize = (): void => {
      setIsLoading(true);
      setError(null);

      try {
        const cartItems = cartService.getItems();

        setItems(cartItems);
      } catch (cause: unknown) {
        console.error(
          "カート情報の取得に失敗しました。",
          cause,
        );

        setItems([]);
        setError(getErrorMessage(cause));
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  /**
   * 商品数量を変更する
   *
   * @param productUuid 商品UUID
   * @param quantity 変更後の数量
   */
  const updateQuantity = (
    productUuid: string,
    quantity: number,
  ): void => {
    setError(null);

    try {
      const updatedItems =
        cartService.updateQuantity(
          productUuid,
          quantity,
        );

      setItems(updatedItems);
    } catch (cause: unknown) {
      console.error(
        "カート内商品の数量変更に失敗しました。",
        cause,
      );

      setError(getErrorMessage(cause));
    }
  };

  /**
   * 商品をカートから削除する
   *
   * @param productUuid 商品UUID
   */
  const removeItem = (
    productUuid: string,
  ): void => {
    setError(null);

    try {
      const updatedItems =
        cartService.removeItem(productUuid);

      setItems(updatedItems);
    } catch (cause: unknown) {
      console.error(
        "カート内商品の削除に失敗しました。",
        cause,
      );

      setError(getErrorMessage(cause));
    }
  };

  /**
   * エラーメッセージを消去する
   */
  const clearError = (): void => {
    setError(null);
  };

  return {
    items,
    totalPrice,
    totalQuantity,
    isLoading,
    error,
    updateQuantity,
    removeItem,
    clearError,
  };
};