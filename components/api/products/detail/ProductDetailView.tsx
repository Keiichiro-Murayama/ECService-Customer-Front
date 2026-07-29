"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useProductDetail } from "@/hooks/products/useProductDetail";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/**
 * 商品詳細画面のProps
 */
type ProductDetailViewProps = {
  /** 商品UUID */
  productUuid: string;
};

/**
 * 金額を日本円表記へ変換する
 *
 * @param price 商品価格
 * @returns 例：1,200円
 */
const formatPrice = (price: number): string => {
  return `${new Intl.NumberFormat("ja-JP").format(price)}円`;
};

/**
 * 商品詳細画面
 *
 * @param props 商品詳細画面のProps
 */
export const ProductDetailView = ({
  productUuid,
}: ProductDetailViewProps) => {
  const router = useRouter();

  /** 商品画像の読み込みに失敗したか */
  const [hasImageError, setHasImageError] =
    useState<boolean>(false);

  const {
    productDetail,
    quantity,
    isLoading,
    error,
    cartError,
    changeQuantity,
    addToCart,
  } = useProductDetail(productUuid);

  /**
   * 商品をカートへ追加する
   */
  const handleAddToCart = (): void => {
    const isSuccess = addToCart();

    if (!isSuccess) {
      return;
    }

    router.push("/purchase/input");
  };

  /**
   * 商品検索画面へ戻る
   */
  const handleBack = (): void => {
    router.push("/products/search");
  };

  /*
   * 商品情報取得中
   */
  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-96 w-full max-w-6xl items-center justify-center px-4 py-8">
        <div className="flex items-center gap-3">
          <Spinner className="size-6" />

          <span className="text-muted-foreground">
            商品情報を取得しています。
          </span>
        </div>
      </main>
    );
  }

  /*
   * 商品詳細取得エラー
   */
  if (error || !productDetail) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">
          商品詳細
        </h1>

        <Alert variant="destructive">
          <AlertDescription>
            {error ?? "商品情報が見つかりません。"}
          </AlertDescription>
        </Alert>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
          >
            商品検索へ戻る
          </Button>
        </div>
      </main>
    );
  }

  const isOutOfStock = productDetail.stock <= 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        商品詳細
      </h1>

      <div className="grid gap-8 rounded-xl border bg-card p-6 md:grid-cols-2">
        {/* 商品画像 */}
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
          {!hasImageError && productDetail.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={productDetail.imageUrl}
              alt={productDetail.productName}
              className="h-full w-full object-contain"
              onError={() => {
                setHasImageError(true);
              }}
            />
          ) : (
            <div className="px-4 text-center text-sm text-muted-foreground">
              商品画像はデプロイ環境で表示されます。
            </div>
          )}
        </div>

        {/* 商品情報 */}
        <div className="flex flex-col">
          <div>
            <h2 className="text-2xl font-bold">
              {productDetail.productName}
            </h2>

            <p className="mt-4 text-3xl font-bold">
              {formatPrice(productDetail.price)}
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              在庫数：{productDetail.stock}
            </p>
          </div>

          {isOutOfStock ? (
            <Alert
              variant="destructive"
              className="mt-8"
            >
              <AlertDescription>
                現在この商品は在庫切れです。
              </AlertDescription>
            </Alert>
          ) : (
            <div className="mt-8">
              <label
                htmlFor="quantity"
                className="mb-2 block text-sm font-medium"
              >
                数量
              </label>

              <select
                id="quantity"
                name="quantity"
                className="h-10 w-full rounded-md border bg-background px-3 md:max-w-xs"
                value={quantity}
                onChange={(event) => {
                  changeQuantity(
                    Number(event.target.value),
                  );
                }}
              >
                {Array.from(
                  {
                    length: productDetail.stock,
                  },
                  (_, index) => index + 1,
                ).map((value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {value}
                  </option>
                ))}
              </select>
            </div>
          )}

          {cartError && (
            <Alert
              variant="destructive"
              className="mt-6"
            >
              <AlertDescription>
                {cartError}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-col">
            <Button
              type="button"
              className="w-full"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              カートに入れる
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleBack}
            >
              商品検索へ戻る
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};