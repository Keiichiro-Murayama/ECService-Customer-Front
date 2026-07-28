import { TYPES } from "@/di/types";
import { CustomerAccountRegistration } from "@/models/CustomerAccountRegistration";
import { CustomerAccountRegistrationResponse } from "@/models/CustomerAccountRegistrationResponse";
import { injectable, inject } from "inversify";
import type { IRegisterCustomerAccountService } from "@/interfaces/IRegisterCustomerAccountService";
import type { ICustomerRepository } from "@/interfaces/ICustomerRepository";

@injectable()
export class RegisterCustomerAccountService implements IRegisterCustomerAccountService {
  constructor(
    @inject(TYPES.ICustomerRepository)
    private customerRepository: ICustomerRepository,
  ) {}

  async registerCustomerAccount(
    request: CustomerAccountRegistration,
  ): Promise<void> {
    await this.customerRepository.registerCustomerAccount(request);
  }
}
