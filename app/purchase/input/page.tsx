import type { Metadata } from "next";

import { PurchaseInputView } from "@/components/api/purchase/input/PurchaseInputView";

/**
 * 購入（入力）ページのメタデータ
 */
export const metadata: Metadata = {
  title: "購入（入力） | フルネス文具",
  description:
    "カートに入れた商品の内容を確認します。",
};

/**
 * 購入（入力）ページ
 *
 * URL: /purchase/input
 */
export default function PurchaseInputPage() {
  return <PurchaseInputView />;
}