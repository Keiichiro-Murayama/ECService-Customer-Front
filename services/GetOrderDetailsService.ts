import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type { IOrderRepository } from "@/interfaces/IOrderRepository";
import type { IGetOrderDetailsService } from "@/interfaces/IGetOrderDetailsService";
import type { OrderDetail } from "@/models/OrderDetail";

/**
 * 注文詳細取得Service
 */
@injectable()
export class GetOrderDetailsService
  implements IGetOrderDetailsService {

  constructor(
    @inject(TYPES.IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  /**
   * 指定した注文の購入履歴詳細を取得する
   *
   * @param orderUuid 注文UUID
   * @returns 注文明細一覧
   */
  async getOrderDetails(
    orderUuid: string
  ): Promise<OrderDetail[]> {
    return await this.orderRepository.getOrderDetails(orderUuid);
  }
}