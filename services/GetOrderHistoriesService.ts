import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type { IOrderRepository } from "@/interfaces/IOrderRepository";
import type { IGetOrderHistoriesService } from "@/interfaces/IGetOrderHistoriesService";
import type { OrderHistory } from "@/models/OrderHistory";

/**
 * 購入履歴一覧取得Service
 */
@injectable()
export class GetOrderHistoriesService
  implements IGetOrderHistoriesService {

  constructor(
    @inject(TYPES.IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  /**
   * ログイン中の顧客の購入履歴一覧を取得する
   *
   * @returns 購入履歴一覧
   */
  async getOrderHistories(): Promise<OrderHistory[]> {
    return await this.orderRepository.getOrderHistories();
  }
}