"use client";

import Link from "next/link";
import type { FormEvent } from "react";

import { useProductSearch } from "@/hooks/products/useProductSearch";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";

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
 * カテゴリ別商品検索画面
 */
export const ProductSearch = () => {
  const {
    categories,
    products,
    selectedCategoryUuid,
    isLoading,
    error,
    setSelectedCategoryUuid,
    search,
  } = useProductSearch();

  /**
   * 検索フォーム送信時の処理
   *
   * @param event フォーム送信イベント
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void search();
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* 画面タイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">カテゴリ別商品検索</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          商品カテゴリを選択して商品を検索できます。
        </p>
      </div>

      {/* 検索条件 */}
      <form
        className="mb-8 rounded-xl border bg-card p-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="w-full md:max-w-md">
            <label
              htmlFor="categorySelect"
              className="mb-2 block text-sm font-medium"
            >
              商品カテゴリ
            </label>

            <NativeSelect
              id="categorySelect"
              name="categorySelect"
              className="w-full"
              value={selectedCategoryUuid}
              disabled={isLoading}
              onChange={(event) => {
                setSelectedCategoryUuid(event.target.value);
              }}
            >
              <NativeSelectOption value="">
                すべてのカテゴリ
              </NativeSelectOption>

              {categories.map((category) => (
                <NativeSelectOption
                  key={category.categoryUuid}
                  value={category.categoryUuid}
                >
                  {category.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                読み込み中
              </>
            ) : (
              "検索"
            )}
          </Button>
        </div>
      </form>

      {/* エラーメッセージ */}
      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 初期表示・検索中 */}
      {isLoading && (
        <div className="flex min-h-48 items-center justify-center gap-2">
          <Spinner className="size-6" />

          <span className="text-muted-foreground">
            商品情報を取得しています。
          </span>
        </div>
      )}

      {/* 検索結果0件 */}
      {!isLoading && !error && products.length === 0 && (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <p className="text-muted-foreground">
            該当する商品が見つかりませんでした
          </p>
        </div>
      )}

      {/* 商品一覧 */}
      {!isLoading && !error && products.length > 0 && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            検索結果：{products.length}件
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Card
                key={product.productUuid}
                className="h-full"
              >
                {/* 商品画像 */}
                {product.imageUrl ? (
                  <div className="aspect-square w-full overflow-hidden bg-muted">
                    {/* APIから取得した商品画像URLを表示する */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-muted">
                    <span className="text-sm text-muted-foreground">
                      画像なし
                    </span>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {product.productName}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="text-lg font-bold">
                    {formatPrice(product.price)}
                  </p>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    className="w-full"
                  >
                    <Link
                      href={`/products/detail/${product.productUuid}`}
                    >
                      詳細
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  );
};