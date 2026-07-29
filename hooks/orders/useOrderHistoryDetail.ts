"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";

import type { IGetOrderDetailsService } from "@/interfaces/IGetOrderDetailsService";
import type { IGetOrderHistoriesService } from "@/interfaces/IGetOrderHistoriesService";

import type { OrderDetail } from "@/models/OrderDetail";


export const useOrderHistoryDetail = (
    orderUuid: string,
) => {

    /**
     * 注文明細取得Service
     */
    const orderDetailsService =
        useMemo(
            () =>
                container.get<IGetOrderDetailsService>(
                    TYPES.IGetOrderDetailsService,
                ),
            [],
        );


    /**
     * 購入履歴一覧取得Service
     */
    const orderHistoriesService =
        useMemo(
            () =>
                container.get<IGetOrderHistoriesService>(
                    TYPES.IGetOrderHistoriesService,
                ),
            [],
        );


    /**
     * 注文明細
     */
    const [details, setDetails] = useState<OrderDetail[]>([]);


    /**
     * 表示用注文ID
     */
    const [orderId, setOrderId] = useState<number | null>(null);

    /**
 * 表示用注文日時
 */
const [orderDate, setOrderDate] = useState<string | null>(null);


/**
 * 表示用合計金額
 */
const [amountTotal, setAmountTotal] = useState<number | null>(null);


    /**
     * ローディング
     */
    const [isLoading, setIsLoading] =
        useState(false);


    /**
     * エラー
     */
    const [error, setError] =
        useState<string | null>(null);



    const load = useCallback(async () => {

        setIsLoading(true);
        setError(null);


        try {

            /**
             * 注文明細取得
             */
            const orderDetails =
                await orderDetailsService.getOrderDetails(
                    orderUuid,
                );


            setDetails(orderDetails);



            /**
             * 購入履歴一覧取得
             */
            const histories =
                await orderHistoriesService.getOrderHistories();



            /**
             * UUID一致する注文を探す
             */
            const history =
                histories.find(
                    (item) =>
                        item.orderUuid === orderUuid,
                );


            if (history) {
    setOrderId(history.orderId);
    setOrderDate(history.orderDate);
    setAmountTotal(history.amountTotal);
}


        } catch (error) {

            console.error(
                "注文詳細取得に失敗しました。",
                error,
            );

            setError(
                "注文詳細の取得に失敗しました。",
            );

        } finally {

            setIsLoading(false);

        }

    }, [
        orderUuid,
        orderDetailsService,
        orderHistoriesService,
    ]);



    useEffect(() => {
        void load();
    }, [load]);



    return {
    details,
    orderId,
    orderDate,
    amountTotal,
    isLoading,
    error,
};
};