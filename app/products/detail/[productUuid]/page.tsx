import type { Metadata } from "next";

import { ProductDetailView } from "@/components/api/products/detail/ProductDetailView";

/**
 * 商品詳細ページのメタデータ
 */
export const metadata: Metadata = {
  title: "商品詳細 | フルネス文具",
  description: "商品の詳細情報を表示します。",
};

/**
 * 商品詳細ページのProps
 */
type ProductDetailPageProps = {
  params: Promise<{
    productUuid: string;
  }>;
};

/**
 * 商品詳細ページ
 *
 * URL: /products/detail/{productUuid}
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { productUuid } = await params;

  return (
    <ProductDetailView
      productUuid={productUuid}
    />
  );
}