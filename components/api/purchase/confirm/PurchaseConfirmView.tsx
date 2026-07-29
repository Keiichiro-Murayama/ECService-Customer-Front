"use client";

import { useRouter } from "next/navigation";

import { usePurchaseConfirm } from "@/hooks/purchase/usePurchaseConfirm";
import { PURCHASE_RESULT_STORAGE_KEY } from "@/lib/storageKeys";
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
 * 購入（確認）画面
 */
export const PurchaseConfirmView = () => {
  const router = useRouter();

  const {
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
    purchase,
  } = usePurchaseConfirm();

  /**
   * 購入入力画面へ戻る
   */
  const handleBack = (): void => {
    router.push("/purchase/input");
  };

  /**
   * 商品検索画面へ遷移する
   */
  const handleContinueShopping = (): void => {
    router.push("/products/search");
  };

  /**
   * 購入を確定する
   */
  const handlePurchase = async (): Promise<void> => {
    const purchaseResponse = await purchase();

    if (!purchaseResponse) {
      return;
    }

    /*
     * 購入完了画面へ渡す購入結果を一時保存する
     */
    window.sessionStorage.setItem(
      PURCHASE_RESULT_STORAGE_KEY,
      JSON.stringify(purchaseResponse),
    );

    /*
     * 戻る操作による二重購入を避けるためreplaceを使用する
     */
    router.replace("/purchase/complete");
  };

  /*
   * 初期情報取得中
   */
  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-96 w-full max-w-6xl items-center justify-center px-4 py-8">
        <div className="flex items-center gap-3">
          <Spinner className="size-6" />

          <span className="text-muted-foreground">
            購入情報を取得しています。
          </span>
        </div>
      </main>
    );
  }

  /*
   * 初期情報取得エラー
   */
  if (loadError) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">
          購入（確認）
        </h1>

        <Alert variant="destructive">
          <AlertDescription>
            {loadError}
          </AlertDescription>
        </Alert>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
          >
            購入入力へ戻る
          </Button>
        </div>
      </main>
    );
  }

  /*
   * カートが空の場合
   */
  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">
          購入（確認）
        </h1>

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
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        購入（確認）
      </h1>

      {/* 商品一覧 */}
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-160">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  商品名
                </th>

                <th className="px-6 py-4 text-right">
                  価格
                </th>

                <th className="px-6 py-4 text-right">
                  数量
                </th>

                <th className="px-6 py-4 text-right">
                  小計
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.productUuid}
                  className="border-b last:border-b-0"
                >
                  <td className="px-6 py-4 font-medium">
                    {item.productName}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {formatPrice(item.price)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {item.quantity}
                  </td>

                  <td className="px-6 py-4 text-right font-bold">
                    {formatPrice(
                      item.price * item.quantity,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 合計 */}
      <section className="mt-6 rounded-xl border bg-card p-6">
        <div className="space-y-3 text-right">
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

      {/* 支払い方法 */}
      <section className="mt-6 rounded-xl border bg-card p-6">
        <label
          htmlFor="paymentMethod"
          className="mb-2 block text-sm font-medium"
        >
          支払い方法
        </label>

        <select
          id="paymentMethod"
          name="paymentMethod"
          className="h-10 w-full rounded-md border bg-background px-3 md:max-w-sm"
          value={selectedPaymentMethodId}
          disabled={isPurchasing}
          onChange={(event) => {
            changePaymentMethod(
              event.target.value,
            );
          }}
        >
          <option value="">
            支払い方法を選択してください
          </option>

          {paymentMethods.map((paymentMethod) => (
            <option
              key={
                paymentMethod.paymentMethodId
              }
              value={
                paymentMethod.paymentMethodId
              }
            >
              {
                paymentMethod.paymentMethodName
              }
            </option>
          ))}
        </select>

        {paymentMethods.length === 0 && (
          <p className="mt-3 text-sm text-destructive">
            選択可能な支払い方法がありません。
          </p>
        )}
      </section>

      {/* エラー */}
      {validationError && (
        <Alert
          variant="destructive"
          className="mt-6"
        >
          <AlertDescription>
            {validationError}
          </AlertDescription>
        </Alert>
      )}

      {purchaseError && (
        <Alert
          variant="destructive"
          className="mt-6"
        >
          <AlertDescription>
            {purchaseError}
          </AlertDescription>
        </Alert>
      )}

      {/* 操作ボタン */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isPurchasing}
          onClick={handleBack}
        >
          戻る
        </Button>

        <Button
          type="button"
          disabled={
            isPurchasing ||
            paymentMethods.length === 0
          }
          onClick={() => {
            void handlePurchase();
          }}
        >
          {isPurchasing ? (
            <>
              <Spinner />
              購入処理中
            </>
          ) : (
            "購入確定"
          )}
        </Button>
      </div>
    </main>
  );
};