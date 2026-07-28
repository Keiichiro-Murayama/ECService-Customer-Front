"use client";

import { useEffect, useState } from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { IAddToCartService } from "@/interfaces/IAddToCartService";
import type { IGetProductDetailService } from "@/interfaces/IGetProductDetailService";
import type { ProductDetail } from "@/models/ProductDetail";

/**
 * 商品詳細取得ServiceをDIコンテナから取得する
 */
const getProductDetailService =
  container.get<IGetProductDetailService>(
    TYPES.IGetProductDetailService,
  );

/**
 * カート追加ServiceをDIコンテナから取得する
 */
const addToCartService =
  container.get<IAddToCartService>(
    TYPES.IAddToCartService,
  );

/**
 * 商品詳細画面の状態と処理を管理するカスタムフック
 *
 * @param productUuid 商品UUID
 */
export const useProductDetail = (
  productUuid: string,
) => {
  /** 商品詳細 */
  const [productDetail, setProductDetail] =
    useState<ProductDetail | null>(null);

  /** 購入数量 */
  const [quantity, setQuantity] =
    useState<number>(1);

  /** 読み込み中かどうか */
  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  /** 商品詳細取得時のエラーメッセージ */
  const [error, setError] =
    useState<string | null>(null);

  /** カート追加時のエラーメッセージ */
  const [cartError, setCartError] =
    useState<string | null>(null);

  /**
   * 商品詳細を取得する
   */
  useEffect(() => {
    let isActive = true;

    const initialize = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setCartError(null);
      setProductDetail(null);

      try {
        const result =
          await getProductDetailService.getProductDetail(
            productUuid,
          );

        if (!isActive) {
          return;
        }

        setProductDetail(result);

        /*
         * 在庫がある場合は数量1、
         * 在庫切れの場合は数量0を設定する
         */
        setQuantity(result.stock > 0 ? 1 : 0);
      } catch (cause: unknown) {
        console.error(
          "商品詳細の取得に失敗しました。",
          cause,
        );

        if (!isActive) {
          return;
        }

        setProductDetail(null);
        setQuantity(0);
        setError(
          "商品情報の取得に失敗しました。",
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
  }, [productUuid]);

  /**
   * 購入数量を変更する
   *
   * @param newQuantity 新しい購入数量
   */
  const changeQuantity = (
    newQuantity: number,
  ): void => {
    if (!productDetail) {
      return;
    }

    if (
      !Number.isInteger(newQuantity) ||
      newQuantity < 1 ||
      newQuantity > productDetail.stock
    ) {
      return;
    }

    setQuantity(newQuantity);
    setCartError(null);
  };

  /**
   * 商品をカートへ追加する
   *
   * @returns 追加に成功した場合true
   */
  const addToCart = (): boolean => {
    setCartError(null);

    if (!productDetail) {
      setCartError(
        "商品情報が取得されていません。",
      );

      return false;
    }

    try {
      addToCartService.addToCart(
        productDetail,
        quantity,
      );

      return true;
    } catch (cause: unknown) {
      console.error(
        "カートへの追加に失敗しました。",
        cause,
      );

      const message =
        cause instanceof Error
          ? cause.message
          : "カートへの追加に失敗しました。";

      setCartError(message);

      return false;
    }
  };

  return {
    productDetail,
    quantity,
    isLoading,
    error,
    cartError,
    changeQuantity,
    addToCart,
  };
};