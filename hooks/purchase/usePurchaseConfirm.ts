"use client";

import { useEffect, useState } from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { signOut, useSession } from "next-auth/react";
import type { IPurchaseConfirmService } from "@/interfaces/IPurchaseConfirmService";
import type { IPurchaseService } from "@/interfaces/IPurchaseService";
import type { CartItem } from "@/models/CartItem";
import type { PaymentMethod } from "@/models/PaymentMethod";
import type { PurchaseResponse } from "@/models/PurchaseResponse";


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
   * ログイン画面へ遷移する
   */
  const redirectToLogin =
    async (): Promise<void> => {
      await signOut({
        redirect: false,
      });

      document.cookie =
        "access_token=; path=/; Max-Age=0; SameSite=Lax";

      window.location.assign(
        "/login?callbackUrl=%2Fpurchase%2Fconfirm",
      );
    };

  /**
   * 購入確認画面の初期データを取得する
   */
  useEffect(() => {
    let isActive = true;

    const initialize =
      async (): Promise<void> => {
        setIsLoading(true);
        setLoadError(null);
        setValidationError(null);
        setPurchaseError(null);

        try {
          const initialData =
            await purchaseConfirmService
              .getInitialData();

          if (!isActive) {
            return;
          }

          const selectablePaymentMethods =
            initialData.paymentMethods.filter(
              (paymentMethod) =>
                paymentMethod
                  .paymentMethodName === "現金",
            );

          setItems(initialData.items);
          setPaymentMethods(
            selectablePaymentMethods,
          );
          setTotalQuantity(
            initialData.totalQuantity,
          );
          setTotalPrice(
            initialData.totalPrice,
          );
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
   */
  const changePaymentMethod = (
    paymentMethodId: string,
  ): void => {
    const normalizedPaymentMethodId =
      paymentMethodId.trim();

    setPurchaseError(null);

    if (!normalizedPaymentMethodId) {
      setSelectedPaymentMethodId("");
      setValidationError(null);
      return;
    }

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
   */
  const purchase =
    async (): Promise<
      PurchaseResponse | null
    > => {
      if (isPurchasing) {
        return null;
      }

      if (!validate()) {
        return null;
      }

      if (status === "loading") {
        return null;
      }

      if (status === "unauthenticated") {
        await redirectToLogin();
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

        setItems([]);
        setTotalQuantity(0);
        setTotalPrice(0);

        return response;
      } catch (cause: unknown) {
        console.error(
          "商品の購入に失敗しました。",
          cause,
        );

        const errorMessage =
          cause instanceof Error
            ? cause.message
            : String(cause);

        console.log(
          "購入エラーメッセージ:",
          errorMessage,
        );

        if (
          errorMessage === "UNAUTHORIZED"
        ) {
          await redirectToLogin();
          return null;
        }

        setPurchaseError(
          errorMessage ||
          "商品の購入に失敗しました。",
        );

        return null;
      } finally {
        setIsPurchasing(false);
      }
    };

  /**
   * 入力エラーを消去する
   */
  const clearValidationError =
    (): void => {
      setValidationError(null);
    };

  /**
   * 購入エラーを消去する
   */
  const clearPurchaseError =
    (): void => {
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