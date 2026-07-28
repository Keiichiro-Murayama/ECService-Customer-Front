import type { Metadata } from "next";

import { ProductSearch } from "@/components/api/products/search/ProductSearch";

/**
 * カテゴリ別商品検索ページのメタデータ
 */
export const metadata: Metadata = {
  title: "カテゴリ別商品検索 | フルネス文具",
  description: "商品カテゴリを選択して商品を検索します。",
};

/**
 * カテゴリ別商品検索ページ
 *
 * URL: /products/search
 */
export default function ProductSearchPage() {
  return <ProductSearch />;
}