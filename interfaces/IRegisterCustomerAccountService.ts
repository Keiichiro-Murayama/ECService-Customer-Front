import { CustomerAccountRegistration } from "@/models/CustomerAccountRegistration";
import { CustomerAccountRegistrationResponse } from "@/models/CustomerAccountRegistrationResponse";

//顧客アカウント登録サービスのインターフェース
export interface IRegisterCustomerAccountService {
  registerCustomerAccount(request: CustomerAccountRegistration): Promise<void>;
}
