"use client";

import { useRouter } from "next/navigation";

import { usePurchaseComplete } from "@/hooks/purchase/usePurchaseComplete";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/**
 * 購入（完了）画面
 */
export const PurchaseCompleteView = () => {
  const router = useRouter();

  const {
    purchaseResult,
    isLoading,
    error,
    clearPurchaseResult,
  } = usePurchaseComplete();

  /**
   * トップ画面へ遷移する
   */
  const handleBackToTop = (): void => {
    clearPurchaseResult();
    router.replace("/");
  };

  /**
   * 購入履歴一覧画面へ遷移する
   */
  const handlePurchaseHistory = (): void => {
    clearPurchaseResult();
    router.replace("/purchase/history");
  };

  /*
   * 購入結果の読み込み中
   */
  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-96 w-full max-w-4xl items-center justify-center px-4 py-8">
        <div className="flex items-center gap-3">
          <Spinner className="size-6" />

          <span className="text-muted-foreground">
            購入結果を確認しています。
          </span>
        </div>
      </main>
    );
  }

  /*
   * 直接アクセスや不正な購入結果
   */
  if (error || !purchaseResult) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">
          購入（完了）
        </h1>

        <Alert variant="destructive">
          <AlertDescription>
            {error ?? "購入結果が見つかりません。"}
          </AlertDescription>
        </Alert>

        <div className="mt-6">
          <Button
            type="button"
            onClick={handleBackToTop}
          >
            トップに戻る
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        購入（完了）
      </h1>

      <section className="rounded-xl border bg-card px-6 py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full border text-3xl">
          ✓
        </div>

        <p className="mt-6 text-2xl font-bold">
          {purchaseResult.message}
        </p>

        <p className="mt-3 text-sm text-muted-foreground">
          ご購入ありがとうございました。
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleBackToTop}
          >
            トップに戻る
          </Button>

          <Button
            type="button"
            onClick={handlePurchaseHistory}
          >
            購入履歴
          </Button>
        </div>
      </section>
    </main>
  );
};