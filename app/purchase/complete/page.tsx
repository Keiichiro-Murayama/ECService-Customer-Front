import type { Metadata } from "next";

import { PurchaseCompleteView } from "@/components/api/purchase/complete/PurchaseCompleteView";

/**
 * 購入（完了）ページのメタデータ
 */
export const metadata: Metadata = {
  title: "購入（完了） | フルネス文具",
  description:
    "商品の購入が完了したことを表示します。",
};

/**
 * 購入（完了）ページ
 *
 * URL: /purchase/complete
 */
export default function PurchaseCompletePage() {
  return <PurchaseCompleteView />;
}