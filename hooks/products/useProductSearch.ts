"use client";

import { useCallback, useEffect, useState } from "react";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { ISearchProductsService } from "@/interfaces/ISearchProductsService";
import type { Category } from "@/models/Category";
import type { Product } from "@/models/Product";

/**
 * カテゴリ別商品検索ServiceをDIコンテナから取得する
 */
const searchProductsService = container.get<ISearchProductsService>(
  TYPES.ISearchProductsService,
);

/**
 * カテゴリ別商品検索画面の状態と処理を管理するカスタムフック
 */
export const useProductSearch = () => {
  /** カテゴリ一覧 */
  const [categories, setCategories] = useState<Category[]>([]);

  /** 商品一覧 */
  const [products, setProducts] = useState<Product[]>([]);

  /** 選択中のカテゴリUUID */
  const [selectedCategoryUuid, setSelectedCategoryUuid] =
    useState<string>("");

  /** データ取得中かどうか */
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /** エラーメッセージ */
  const [error, setError] = useState<string | null>(null);

  /**
   * 初期表示データを取得する
   *
   * カテゴリ一覧と全商品一覧を取得する。
   */
  useEffect(() => {
    let isActive = true;

    const initialize = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const initialData = await searchProductsService.getInitialData();

        if (!isActive) {
          return;
        }

        setCategories(initialData.categories);
        setProducts(initialData.products);
      } catch (cause: unknown) {
        console.error("カテゴリ別商品検索の初期表示に失敗しました。", cause);

        if (!isActive) {
          return;
        }

        setCategories([]);
        setProducts([]);
        setError(
          "カテゴリ情報または商品情報の取得に失敗しました。",
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
   * 選択されたカテゴリで商品を検索する
   */
  const search = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const searchResult = await searchProductsService.search(
        selectedCategoryUuid,
      );

      setProducts(searchResult);
    } catch (cause: unknown) {
      console.error("カテゴリ別の商品検索に失敗しました。", cause);

      setProducts([]);
      setError("商品情報の取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryUuid]);

  return {
    categories,
    products,
    selectedCategoryUuid,
    isLoading,
    error,
    setSelectedCategoryUuid,
    search,
  };
};