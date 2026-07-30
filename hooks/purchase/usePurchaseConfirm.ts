"use client";

import { useEffect, useState } from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useSession, } from "next-auth/react";
import type { IPurchaseConfirmService } from "@/interfaces/IPurchaseConfirmService";
import type { IPurchaseService } from "@/interfaces/IPurchaseService";
import type { CartItem } from "@/models/CartItem";
import type { PaymentMethod } from "@/models/PaymentMethod";
import type { PurchaseResponse } from "@/models/PurchaseResponse";
import { useRouter } from "next/navigation";

/**
 * 購入確認ServiceをDIコンテナから取得する
 */
const purchaseConfirmService =
  container.get<IPurchaseConfirmService>(
    TYPES.IPurchaseConfirmService,
  );

/**
 * 商品購入ServiceをDIコンテナから取得する
 */
const purchaseService =
  container.get<IPurchaseService>(
    TYPES.IPurchaseService,
  );

/**
 * 不明な例外からエラーメッセージを取得する
 *
 * @param cause 発生した例外
 * @param fallbackMessage 既定のエラーメッセージ
 * @returns エラーメッセージ
 */
const getErrorMessage = (
  cause: unknown,
  fallbackMessage: string,
): string => {
  if (cause instanceof Error) {
    return cause.message;
  }

  return fallbackMessage;
};

/**
 * 購入確認画面の状態と処理を管理するカスタムフック
 */
export const usePurchaseConfirm = () => {
  const router = useRouter();
  const { status } = useSession();
  /** カート内の商品一覧 */
  const [items, setItems] = useState<CartItem[]>([]);

  /** 選択可能な支払い方法一覧 */
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>([]);

  /** 選択中の支払い方法ID */
  const [
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
  ] = useState<string>("");

  /** 合計数量 */
  const [totalQuantity, setTotalQuantity] =
    useState<number>(0);

  /** 合計金額 */
  const [totalPrice, setTotalPrice] =
    useState<number>(0);

  /** 初期データ取得中かどうか */
  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  /** 購入処理中かどうか */
  const [isPurchasing, setIsPurchasing] =
    useState<boolean>(false);

  /** 初期データ取得時のエラー */
  const [loadError, setLoadError] =
    useState<string | null>(null);

  /** 入力内容のエラー */
  const [validationError, setValidationError] =
    useState<string | null>(null);

  /** 購入処理時のエラー */
  const [purchaseError, setPurchaseError] =
    useState<string | null>(null);

  /**
   * 購入確認画面の初期データを取得する
   */
  useEffect(() => {
    let isActive = true;

    const initialize = async (): Promise<void> => {
      setIsLoading(true);
      setLoadError(null);
      setValidationError(null);
      setPurchaseError(null);

      try {
        const initialData =
          await purchaseConfirmService.getInitialData();

        if (!isActive) {
          return;
        }

        /*
         * 現時点では「現金」のみ選択可能とする
         */
        const selectablePaymentMethods =
          initialData.paymentMethods.filter(
            (paymentMethod) =>
              paymentMethod.paymentMethodName ===
              "現金",
          );

        setItems(initialData.items);
        setPaymentMethods(
          selectablePaymentMethods,
        );
        setTotalQuantity(
          initialData.totalQuantity,
        );
        setTotalPrice(initialData.totalPrice);

        /*
         * 支払い方法は初期状態では未選択とする
         */
        setSelectedPaymentMethodId("");
      } catch (cause: unknown) {
        console.error(
          "購入確認情報の取得に失敗しました。",
          cause,
        );

        if (!isActive) {
          return;
        }

        setItems([]);
        setPaymentMethods([]);
        setSelectedPaymentMethodId("");
        setTotalQuantity(0);
        setTotalPrice(0);

        setLoadError(
          getErrorMessage(
            cause,
            "購入確認情報の取得に失敗しました。",
          ),
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      isActive = false;
    };
  }, []);

  /**
   * 支払い方法を変更する
   *
   * @param paymentMethodId 支払い方法ID
   */
  const changePaymentMethod = (
    paymentMethodId: string,
  ): void => {
    const normalizedPaymentMethodId =
      paymentMethodId.trim();

    setPurchaseError(null);

    /*
     * 未選択へ戻した場合
     */
    if (!normalizedPaymentMethodId) {
      setSelectedPaymentMethodId("");
      setValidationError(null);

      return;
    }

    /*
     * APIから取得した支払い方法に
     * 存在するIDか確認する
     */
    const existsPaymentMethod =
      paymentMethods.some(
        (paymentMethod) =>
          paymentMethod.paymentMethodId ===
          normalizedPaymentMethodId,
      );

    if (!existsPaymentMethod) {
      setSelectedPaymentMethodId("");

      setValidationError(
        "支払い方法を選択してください。",
      );

      return;
    }

    setSelectedPaymentMethodId(
      normalizedPaymentMethodId,
    );

    setValidationError(null);
  };

  /**
   * 購入内容を検証する
   *
   * @returns 正常な場合true
   */
  const validate = (): boolean => {
    setValidationError(null);
    setPurchaseError(null);

    if (items.length === 0) {
      setValidationError(
        "カートに商品がありません。",
      );

      return false;
    }

    if (!selectedPaymentMethodId) {
      setValidationError(
        "支払い方法を選択してください。",
      );

      return false;
    }

    const existsPaymentMethod =
      paymentMethods.some(
        (paymentMethod) =>
          paymentMethod.paymentMethodId ===
          selectedPaymentMethodId,
      );

    if (!existsPaymentMethod) {
      setValidationError(
        "支払い方法を選択してください。",
      );

      return false;
    }

    return true;
  };

  /**
   * 商品の購入を確定する
   *
   * @returns
   * 購入成功時は購入結果、
   * 失敗時はnull
   */
  const purchase =
    async (): Promise<PurchaseResponse | null> => {
      /*
       * 二重送信を防止する
       */
      if (isPurchasing) {
        return null;
      }

      if (!validate()) {
        return null;
      }

      /*
       * 未ログインの場合はログイン画面へ遷移する
       */
      if (status === "loading") {
        return null;
      }

      if (status === "unauthenticated") {
        router.push(
          "/login?callbackUrl=/purchase/confirm",
        );

        return null;
      }

      setIsPurchasing(true);
      setPurchaseError(null);

      try {
        const response =
          await purchaseService.purchase(
            selectedPaymentMethodId,
            items,
          );

        /*
         * PurchaseService側で
         * 購入成功後にカートが空にされる
         */
        setItems([]);
        setTotalQuantity(0);
        setTotalPrice(0);

        return response;
      } catch (cause: unknown) {
        console.error(
          "商品の購入に失敗しました。",
          cause,
        );

        setPurchaseError(
          getErrorMessage(
            cause,
            "商品の購入に失敗しました。",
          ),
        );

        return null;
      } finally {
        setIsPurchasing(false);
      }
    };

  /**
   * 入力エラーを消去する
   */
  const clearValidationError = (): void => {
    setValidationError(null);
  };

  /**
   * 購入エラーを消去する
   */
  const clearPurchaseError = (): void => {
    setPurchaseError(null);
  };

  return {
    items,
    paymentMethods,
    selectedPaymentMethodId,
    totalQuantity,
    totalPrice,
    isLoading,
    isPurchasing,
    loadError,
    validationError,
    purchaseError,
    changePaymentMethod,
    validate,
    purchase,
    clearValidationError,
    clearPurchaseError,
  };
};