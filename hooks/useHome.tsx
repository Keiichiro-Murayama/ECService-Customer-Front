// hooks/useHome.tsx
import { useState, useEffect } from "react";
import type { Product } from "@/models/Product";
import type { ISearchProductsService } from "@/interfaces/ISearchProductsService";
import { TYPES } from "@/di/types";
import { container } from "@/di/container";

export function useHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // DIコンテナからサービスを解決（インスタンス化）
        const searchProductsService = container.get<ISearchProductsService>(
          TYPES.ISearchProductsService,
        );

        // 全商品の取得（引数なしで全商品が返る仕様を活用）
        const data = await searchProductsService.search();

        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch products"),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading, error };
}
