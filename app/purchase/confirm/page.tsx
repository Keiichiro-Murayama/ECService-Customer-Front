import type { Metadata } from "next";

import { PurchaseConfirmView } from "@/components/api/purchase/confirm/PurchaseConfirmView";

/**
 * 購入（確認）ページのメタデータ
 */
export const metadata: Metadata = {
  title: "購入（確認） | フルネス文具",
  description:
    "購入内容と支払い方法を確認します。",
};

/**
 * 購入（確認）ページ
 *
 * URL: /purchase/confirm
 */
export default function PurchaseConfirmPage() {
  return <PurchaseConfirmView />;
}