"use client";

import Link from "next/link";

import { useOrderHistoryDetail } from "@/hooks/orders/useOrderHistoryDetail";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  orderUuid: string;
  orderUuid: string;
};

/**
 * 注文履歴詳細画面
 */
export const OrderHistoryDetail = ({ orderUuid }: Props) => {
  const { details, orderId, orderDate, amountTotal, isLoading, error } =
    useOrderHistoryDetail(orderUuid);
export const OrderHistoryDetail = ({ orderUuid }: Props) => {
  const { details, orderId, orderDate, amountTotal, isLoading, error } =
    useOrderHistoryDetail(orderUuid);

  /**
   * 注文日時表示用フォーマット
   */
  const formattedOrderDate = orderDate
    ? new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Tokyo",
      }).format(new Date(orderDate))
    : "";
  /**
   * 注文日時表示用フォーマット
   */
  const formattedOrderDate = orderDate
    ? new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Tokyo",
      }).format(new Date(orderDate))
    : "";

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-bold">購入履歴詳細</h1>
      zzz
      {isLoading && <p>読み込み中...</p>}
      {!isLoading && error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <>
          {/* 注文情報 */}
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="my-8 text-3xl font-bold">購入履歴詳細</h1>

      {isLoading && <p>読み込み中...</p>}

      {!isLoading && error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <Card>
          <CardContent>
            {/* 注文情報 */}

          <h2 className="mb-4 text-xl font-semibold">注文情報</h2>
            <h2 className="m-4 text-xl font-semibold">注文情報</h2>

          <Table className="mb-10">
            <TableHeader>
              <TableRow>
                <TableHead>注文ID</TableHead>
            <Table className="mb-10">
              <TableHeader>
                <TableRow>
                  <TableHead>注文ID</TableHead>

                <TableHead>注文日時</TableHead>
                  <TableHead>注文日時</TableHead>

                <TableHead className="text-right">合計金額</TableHead>
              </TableRow>
            </TableHeader>
                  <TableHead className="text-right">合計金額</TableHead>
                </TableRow>
              </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>{orderId}</TableCell>
              <TableBody>
                <TableRow>
                  <TableCell>{orderId}</TableCell>

                <TableCell>{formattedOrderDate}</TableCell>
                  <TableCell>{formattedOrderDate}</TableCell>

                <TableCell className="text-right">
                  ¥{amountTotal?.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
                  <TableCell className="text-right">
                    ¥{amountTotal?.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

          {/* 注文明細 */}
            {/* 注文明細 */}

          <h2 className="mb-4 text-xl font-semibold">注文明細</h2>
            <h2 className="mb-4 text-xl font-semibold">注文明細</h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品名</TableHead>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品名</TableHead>

                <TableHead className="text-right">価格</TableHead>
                  <TableHead className="text-right">価格</TableHead>

                <TableHead className="text-right">個数</TableHead>
              </TableRow>
            </TableHeader>
                  <TableHead className="text-right">個数</TableHead>
                </TableRow>
              </TableHeader>

            <TableBody>
              {details.map((detail) => (
                <TableRow key={detail.productUuid}>
                  <TableCell>{detail.productName}</TableCell>
              <TableBody>
                {details.map((detail) => (
                  <TableRow key={detail.productUuid}>
                    <TableCell>{detail.productName}</TableCell>

                  <TableCell className="text-right">
                    ¥{detail.price.toLocaleString()}
                  </TableCell>
                    <TableCell className="text-right">
                      ¥{detail.price.toLocaleString()}
                    </TableCell>

                  <TableCell className="text-right">
                    {detail.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
                    <TableCell className="text-right">
                      {detail.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-8 flex justify-end">
              <Button asChild>
                <Link href="/purchase/history">戻る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
