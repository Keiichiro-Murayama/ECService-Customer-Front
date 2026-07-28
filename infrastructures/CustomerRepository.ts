import { injectable } from "inversify";

import type { ICustomerRepository } from "@/interfaces/ICustomerRepository";
import type { CustomerAccountRegistration } from "@/models/CustomerAccountRegistration";
import type { CustomerAccountRegistrationResponse } from "@/models/CustomerAccountRegistrationResponse";

/**
 * APIから返されるエラーレスポンス
 */
type ErrorResponse = {
  message?: string;
};

/**
 * 顧客に関するデータアクセスを行うRepository
 */
@injectable()
export class CustomerRepository implements ICustomerRepository {
  /**
   * 顧客アカウント登録APIのエンドポイント
   * Next.jsのAPIプロキシを経由して顧客側APIへアクセスする
   */
  private readonly endpoint = "/proxy-api/accounts";

  /**
   * 顧客アカウントを登録する
   * @param customerAccountRegistration 顧客アカウント登録情報
   * @returns 顧客アカウント登録結果
   */
  async registerCustomerAccount(
    customerAccountRegistration: CustomerAccountRegistration,
  ): Promise<CustomerAccountRegistrationResponse> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(customerAccountRegistration),
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as ErrorResponse;

      throw new Error(
        errorData.message ??
          `顧客アカウントの登録に失敗しました。(status: ${response.status})`,
      );
    }

    return (await response.json()) as CustomerAccountRegistrationResponse;
  }
}
