import { injectable } from "inversify";

import type { IPaymentMethodRepository } from "@/interfaces/IPaymentMethodRepository";
import type { PaymentMethod } from "@/models/PaymentMethod";

/**
 * APIから返されるエラーレスポンス
 */
type ErrorResponse = {
  message?: string;
};

/**
 * 支払い方法に関するデータアクセスを行うRepository
 */
@injectable()
export class PaymentMethodRepository
  implements IPaymentMethodRepository
{
  /**
   * 支払い方法一覧取得APIのエンドポイント
   * Next.jsのAPIプロキシを経由して顧客側APIへアクセスする
   */
  private readonly endpoint = "/proxy-api/payments";

  /**
   * 支払い方法一覧を取得する
   * @returns 支払い方法一覧
   */
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch(this.endpoint, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as ErrorResponse;

      throw new Error(
        errorData.message ??
          `支払い方法の取得に失敗しました。(status: ${response.status})`,
      );
    }

    const data = (await response.json()) as unknown;

    if (!Array.isArray(data)) {
      console.error(
        "支払い方法一覧取得APIのレスポンス:",
        data,
      );

      throw new Error(
        "支払い方法一覧取得APIのレスポンス形式が不正です。",
      );
    }

    return data as PaymentMethod[];
  }
}
