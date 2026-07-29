"use client";

import { useEffect, useState } from "react";

import { PURCHASE_RESULT_STORAGE_KEY } from "@/lib/storageKeys";
import type { PurchaseResponse } from "@/models/PurchaseResponse";

/**
 * 値がPurchaseResponse形式か確認する
 *
 * @param value 確認対象
 * @returns PurchaseResponse形式の場合true
 */
const isPurchaseResponse = (
  value: unknown,
): value is PurchaseResponse => {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const response =
    value as Record<string, unknown>;

  return (
    typeof response.orderUuid === "string" &&
    response.orderUuid.trim().length > 0 &&
    typeof response.message === "string" &&
    response.message.trim().length > 0
  );
};

/**
 * 購入完了画面の状態を管理するカスタムフック
 */
export const usePurchaseComplete = () => {
  /** 購入結果 */
  const [purchaseResult, setPurchaseResult] =
    useState<PurchaseResponse | null>(null);

  /** 読み込み中かどうか */
  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  /** エラーメッセージ */
  const [error, setError] =
    useState<string | null>(null);

  /**
   * sessionStorageから購入結果を取得する
   */
  useEffect(() => {
    const initialize = (): void => {
      setIsLoading(true);
      setError(null);

      try {
        const storedValue =
          window.sessionStorage.getItem(
            PURCHASE_RESULT_STORAGE_KEY,
          );

        /*
         * 購入処理を経由せずに直接アクセスした場合
         */
        if (!storedValue) {
          setPurchaseResult(null);
          setError("不正なアクセスです。");

          return;
        }

        const parsedValue: unknown =
          JSON.parse(storedValue);

        /*
         * 保存されている購入結果が不正な場合
         */
        if (!isPurchaseResponse(parsedValue)) {
          window.sessionStorage.removeItem(
            PURCHASE_RESULT_STORAGE_KEY,
          );

          setPurchaseResult(null);
          setError(
            "購入結果の取得に失敗しました。",
          );

          return;
        }

        setPurchaseResult(parsedValue);
      } catch (cause: unknown) {
        console.error(
          "購入結果の読み込みに失敗しました。",
          cause,
        );

        window.sessionStorage.removeItem(
          PURCHASE_RESULT_STORAGE_KEY,
        );

        setPurchaseResult(null);
        setError(
          "購入結果の取得に失敗しました。",
        );
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  /**
   * 保存されている購入結果を削除する
   */
  const clearPurchaseResult = (): void => {
    window.sessionStorage.removeItem(
      PURCHASE_RESULT_STORAGE_KEY,
    );

    setPurchaseResult(null);
  };

  return {
    purchaseResult,
    isLoading,
    error,
    clearPurchaseResult,
  };
};