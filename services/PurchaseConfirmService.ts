import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type {
  IPurchaseConfirmService,
  PurchaseConfirmInitialData,
} from "@/interfaces/IPurchaseConfirmService";
import type { ICartRepository } from "@/interfaces/ICartRepository";
import type { IPaymentMethodRepository } from "@/interfaces/IPaymentMethodRepository";

/**
 * 購入確認画面の初期表示処理を担当するService
 */
@injectable()
export class PurchaseConfirmService
  implements IPurchaseConfirmService
{
  /**
   * コンストラクタ
   *
   * @param cartRepository カートRepository
   * @param paymentMethodRepository 支払い方法Repository
   */
  constructor(
    @inject(TYPES.ICartRepository)
    private readonly cartRepository: ICartRepository,

    @inject(TYPES.IPaymentMethodRepository)
    private readonly paymentMethodRepository:
      IPaymentMethodRepository,
  ) {}

  /**
   * 購入確認画面の初期表示データを取得する
   *
   * @returns カート情報、支払い方法、合計情報
   */
  async getInitialData(): Promise<PurchaseConfirmInitialData> {
    const items = this.cartRepository.getItems();

    /*
     * カートが空の場合でも、
     * 支払い方法一覧は取得する
     */
    const paymentMethods =
      await this.paymentMethodRepository
        .getAllPaymentMethods();

    const totalQuantity = items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const totalPrice = items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0,
    );

    return {
      items,
      paymentMethods,
      totalQuantity,
      totalPrice,
    };
  }
}