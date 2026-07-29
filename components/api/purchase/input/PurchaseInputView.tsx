"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/hooks/cart/useCart";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/**
 * 金額を日本円表記へ変換する
 *
 * @param price 金額
 * @returns 例：1,200円
 */
const formatPrice = (price: number): string => {
  return `${new Intl.NumberFormat("ja-JP").format(
    price,
  )}円`;
};

/**
 * 購入（入力）画面
 */
export const PurchaseInputView = () => {
  const router = useRouter();

  /** 読み込みに失敗した商品画像のUUID */
  const [imageErrorProductUuids, setImageErrorProductUuids] =
    useState<Set<string>>(new Set());

  const {
    items,
    totalPrice,
    totalQuantity,
    isLoading,
    error,
    updateQuantity,
    removeItem,
  } = useCart();

  /**
   * 商品画像の読み込み失敗状態を設定する
   *
   * @param productUuid 商品UUID
   */
  const handleImageError = (
    productUuid: string,
  ): void => {
    setImageErrorProductUuids((current) => {
      const updated = new Set(current);

      updated.add(productUuid);

      return updated;
    });
  };

  /**
   * 商品検索画面へ遷移する
   */
  const handleContinueShopping = (): void => {
    router.push("/products/search");
  };

  /**
   * 購入確認画面へ遷移する
   */
  const handlePurchaseProcedure = (): void => {
    router.push("/purchase/confirm");
  };

  /*
   * カート情報取得中
   */
  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-96 w-full max-w-6xl items-center justify-center px-4 py-8">
        <div className="flex items-center gap-3">
          <Spinner className="size-6" />

          <span className="text-muted-foreground">
            カート情報を取得しています。
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        購入（入力）
      </h1>

      {error && (
        <Alert
          variant="destructive"
          className="mb-6"
        >
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* カートが空の場合 */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="text-muted-foreground">
            カートに商品が入っていません。
          </p>

          <Button
            type="button"
            className="mt-6"
            onClick={handleContinueShopping}
          >
            商品を探す
          </Button>
        </div>
      ) : (
        <>
          {/* カート内商品一覧 */}
          <div className="space-y-6">
            {items.map((item) => {
              const hasImageError =
                imageErrorProductUuids.has(
                  item.productUuid,
                );

              const subtotal =
                item.price * item.quantity;

              return (
                <section
                  key={item.productUuid}
                  className="grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-[180px_1fr]"
                >
                  {/* 商品画像 */}
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {!hasImageError &&
                    item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-contain"
                        onError={() => {
                          handleImageError(
                            item.productUuid,
                          );
                        }}
                      />
                    ) : (
                      <span className="px-3 text-center text-sm text-muted-foreground">
                        商品画像はデプロイ環境で
                        表示されます。
                      </span>
                    )}
                  </div>

                  {/* 商品情報 */}
                  <div className="flex flex-col justify-between gap-6">
                    <div>
                      <h2 className="text-xl font-bold">
                        {item.productName}
                      </h2>

                      <p className="mt-2">
                        単価：
                        {formatPrice(item.price)}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        在庫数：{item.stock}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <label
                          htmlFor={`quantity-${item.productUuid}`}
                          className="mb-2 block text-sm font-medium"
                        >
                          数量
                        </label>

                        <input
                          id={`quantity-${item.productUuid}`}
                          name={`quantity-${item.productUuid}`}
                          type="number"
                          min={1}
                          max={item.stock}
                          step={1}
                          className="h-10 w-32 rounded-md border bg-background px-3"
                          value={item.quantity}
                          onChange={(event) => {
                            const newQuantity =
                              Number(
                                event.target.value,
                              );

                            if (
                              Number.isInteger(
                                newQuantity,
                              ) &&
                              newQuantity >= 1 &&
                              newQuantity <=
                                item.stock
                            ) {
                              updateQuantity(
                                item.productUuid,
                                newQuantity,
                              );
                            }
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <p className="min-w-40 text-lg font-bold">
                          小計：
                          {formatPrice(subtotal)}
                        </p>

                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            removeItem(
                              item.productUuid,
                            );
                          }}
                        >
                          削除
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* 合計 */}
          <section className="mt-8 rounded-xl border bg-card p-6">
            <div className="flex flex-col gap-3 text-right">
              <p>
                合計数量：
                <span className="ml-2 font-bold">
                  {totalQuantity}点
                </span>
              </p>

              <p className="text-2xl font-bold">
                合計金額：
                <span className="ml-2">
                  {formatPrice(totalPrice)}
                </span>
              </p>
            </div>
          </section>

          {/* 操作ボタン */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleContinueShopping}
            >
              買い物を続ける
            </Button>

            <Button
              type="button"
              onClick={handlePurchaseProcedure}
            >
              購入手続きへ
            </Button>
          </div>
        </>
      )}
    </main>
  );
};