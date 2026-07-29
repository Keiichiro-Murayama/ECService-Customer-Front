"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { IGetOrderHistoriesService } from "@/interfaces/IGetOrderHistoriesService";
import type { OrderHistory } from "@/models/OrderHistory";

/**
 * 例外から画面表示用のメッセージを取得する
 *
 * @param error 発生した例外
 * @param fallbackMessage メッセージを取得できない場合の既定値
 * @returns 画面に表示するエラーメッセージ
 */
const getErrorMessage = (
    error: unknown,
    fallbackMessage: string,
): string => {
    if (error instanceof Error && error.message.trim() !== "") {
        return error.message;
    }

    return fallbackMessage;
};

/**
 * 購入履歴一覧画面の状態と処理を管理するカスタムフック
 */
export const useOrderHistory = () => {

    /**
     * DIコンテナから購入履歴取得サービスを取得する
     */
    const getOrderHistoriesService = useMemo(
        () =>
            container.get<IGetOrderHistoriesService>(
                TYPES.IGetOrderHistoriesService,
            ),
        [],
    );

    /**
     * 購入履歴一覧
     */
    const [orderHistories, setOrderHistories] =
        useState<OrderHistory[]>([]);

    /**
     * API通信中かどうか
     */
    const [isLoading, setIsLoading] =
        useState<boolean>(false);

    /**
     * 画面表示用エラーメッセージ
     */
    const [error, setError] =
        useState<string | null>(null);

    /**
     * 購入履歴一覧を取得する
     */
    const loadOrderHistories = useCallback(async (): Promise<void> => {

        setIsLoading(true);
        setError(null);

        try {

            const histories =
                await getOrderHistoriesService.getOrderHistories();

            setOrderHistories(histories);

        } catch (error: unknown) {

            console.error(
                "購入履歴の取得に失敗しました。",
                error,
            );

            setOrderHistories([]);

            setError(
                getErrorMessage(
                    error,
                    "購入履歴の取得に失敗しました。",
                ),
            );

        } finally {

            setIsLoading(false);

        }

    }, [getOrderHistoriesService]);

    /**
     * 初回表示時に購入履歴一覧を取得する
     */
    useEffect(() => {

        const animationFrameId =
            window.requestAnimationFrame(() => {

                void loadOrderHistories();

            });

        return () => {

            window.cancelAnimationFrame(
                animationFrameId,
            );

        };

    }, [loadOrderHistories]);

    return {
        orderHistories,
        isLoading,
        error,
        reload: loadOrderHistories,
    };
};