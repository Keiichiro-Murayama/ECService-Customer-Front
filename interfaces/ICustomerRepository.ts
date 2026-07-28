import type { CustomerAccountRegistration } from "@/models/CustomerAccountRegistration";
import type { CustomerAccountRegistrationResponse } from "@/models/CustomerAccountRegistrationResponse";

/**
 * 顧客Repositoryのインターフェイス
 */
export interface ICustomerRepository {
  /**
   * 顧客アカウントを登録する
   * @param customerAccountRegistration 顧客アカウント登録情報
   * @returns 顧客アカウント登録結果
   */
  registerCustomerAccount(
    customerAccountRegistration: CustomerAccountRegistration
  ): Promise<CustomerAccountRegistrationResponse>;
}
