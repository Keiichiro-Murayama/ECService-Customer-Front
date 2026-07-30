import { injectable } from "inversify";
import { getSession } from "next-auth/react";

import type { IOrderRepository } from "@/interfaces/IOrderRepository";
import type { OrderDetail } from "@/models/OrderDetail";
import type { OrderHistory } from "@/models/OrderHistory";
import type { PurchaseRequest } from "@/models/PurchaseRequest";
import type { PurchaseResponse } from "@/models/PurchaseResponse";

/**
 * APIから返されるエラーレスポンス
 */
type ErrorResponse = {
  message?: string;
};

/**
 * NextAuthのセッション内に保持される認証情報
 */
type AuthSession = {
  user?: {
    token?: string;
  };
};

/**
 * 注文に関するデータアクセスを行うRepository
 */
@injectable()
export class OrderRepository implements IOrderRepository {
  /**
   * 注文APIのエンドポイント
   * Next.jsのAPIプロキシを経由して顧客側APIへアクセスする
   */
  private readonly endpoint = "/proxy-api/orders";

  /**
   * 商品の購入を確定する
   *
   * @param purchaseRequest 商品購入情報
   * @returns 商品購入結果
   */
  async purchase(
    purchaseRequest: PurchaseRequest,
  ): Promise<PurchaseResponse> {
    const authorizationHeader =
      await this.getAuthorizationHeader();

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authorizationHeader,
      },
      credentials: "include",
      body: JSON.stringify(purchaseRequest),
    });

    /*
     * 未ログインまたはJWTの有効期限切れの場合
     */
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          `商品の購入に失敗しました。(status: ${response.status})`,
        ),
      );
    }

    return (await response.json()) as PurchaseResponse;
  }

  /**
   * ログイン中の顧客の購入履歴一覧を取得する
   *
   * @returns 購入履歴一覧
   */
  async getOrderHistories(): Promise<OrderHistory[]> {
    const authorizationHeader =
      await this.getAuthorizationHeader();

    const response = await fetch(this.endpoint, {
      method: "GET",
      headers: authorizationHeader,
      credentials: "include",
    });

    /*
     * 未ログインまたはJWTの有効期限切れの場合
     */
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          `購入履歴の取得に失敗しました。(status: ${response.status})`,
        ),
      );
    }

    const data = (await response.json()) as unknown;

    if (!Array.isArray(data)) {
      console.error(
        "購入履歴取得APIのレスポンス:",
        data,
      );

      throw new Error(
        "購入履歴取得APIのレスポンス形式が不正です。",
      );
    }

    return data as OrderHistory[];
  }

  /**
   * 指定した注文の購入履歴詳細を取得する
   *
   * @param orderUuid 注文UUID
   * @returns 注文明細一覧
   */
  async getOrderDetails(
    orderUuid: string,
  ): Promise<OrderDetail[]> {
    const normalizedOrderUuid =
      orderUuid.trim();

    if (normalizedOrderUuid.length === 0) {
      throw new Error(
        "注文UUIDを指定してください。",
      );
    }

    const authorizationHeader =
      await this.getAuthorizationHeader();

    const response = await fetch(
      `${this.endpoint}/${encodeURIComponent(
        normalizedOrderUuid,
      )}`,
      {
        method: "GET",
        headers: authorizationHeader,
        credentials: "include",
      },
    );

    /*
     * 未ログインまたはJWTの有効期限切れの場合
     */
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          `購入履歴詳細の取得に失敗しました。(status: ${response.status})`,
        ),
      );
    }

    const data = (await response.json()) as unknown;

    if (!Array.isArray(data)) {
      console.error(
        "購入履歴詳細取得APIのレスポンス:",
        data,
      );

      throw new Error(
        "購入履歴詳細取得APIのレスポンス形式が不正です。",
      );
    }

    return data as OrderDetail[];
  }

  /**
   * NextAuthのセッションから認証ヘッダーを取得する
   *
   * @returns Authorizationヘッダー
   */
  private async getAuthorizationHeader(): Promise<
    Record<string, string>
  > {
    const session =
      (await getSession()) as AuthSession | null;

    const token = session?.user?.token;

    /*
     * 未ログインなどによりセッション内に
     * JWTが存在しない場合
     */
    if (
      typeof token !== "string" ||
      token.trim() === ""
    ) {
      throw new Error("UNAUTHORIZED");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * APIのエラーレスポンスからメッセージを取得する
   *
   * @param response APIレスポンス
   * @param fallbackMessage メッセージ取得失敗時の既定値
   * @returns エラーメッセージ
   */
  private async getErrorMessage(
    response: Response,
    fallbackMessage: string,
  ): Promise<string> {
    const errorData = (await response
      .json()
      .catch(() => ({}))) as ErrorResponse;

    return errorData.message ?? fallbackMessage;
  }
}