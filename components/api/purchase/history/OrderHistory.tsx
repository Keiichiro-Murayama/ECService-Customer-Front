"use client";

import Link from "next/link";

import { useOrderHistory } from "@/hooks/orders/useOrderHistory";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
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

/**
 * 購入履歴一覧画面
 */
export const OrderHistory = () => {
    const {
        orderHistories,
        isLoading,
        error,
    } = useOrderHistory();

    return (
        <Card className="mx-auto max-w-4xl">
            <CardHeader>
                <CardTitle>注文履歴一覧</CardTitle>
            </CardHeader>

            <CardContent>
                {isLoading && (
                    <p>読み込み中...</p>
                )}

                {!isLoading && error && (
                    <p className="text-red-500">{error}</p>
                )}

                {!isLoading && !error && orderHistories.length === 0 && (
                    <p>購入履歴がありません。</p>
                )}

                {!isLoading && !error && orderHistories.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>注文ID</TableHead>
                                <TableHead>注文日時</TableHead>
                                <TableHead className="text-right">
                                    合計金額
                                </TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orderHistories.map((history) => (
                                <TableRow key={history.orderUuid}>
                                    <TableCell>
                                        {history.orderId}
                                    </TableCell>

                                    <TableCell>
                                        {new Intl.DateTimeFormat("ja-JP", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            weekday: "short",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                            timeZone: "Asia/Tokyo",
                                        }).format(new Date(history.orderDate))}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        ¥{history.amountTotal.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button asChild>
                                            <Link
                                                href={`/purchase/history/${history.orderUuid}?orderId=${history.orderId}`}
                                            >
                                                詳細
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};