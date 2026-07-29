import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type { ICartRepository } from "@/interfaces/ICartRepository";
import type { IOrderRepository } from "@/interfaces/IOrderRepository";
import type { IPurchaseService } from "@/interfaces/IPurchaseService";
import type { CartItem } from "@/models/CartItem";
import type { PurchaseRequest } from "@/models/PurchaseRequest";
import type { PurchaseResponse } from "@/models/PurchaseResponse";

/**
 * 商品購入処理を担当するService
 */
@injectable()
export class PurchaseService implements IPurchaseService {
  /**
   * コンストラクタ
   *
   * @param orderRepository 注文Repository
   * @param cartRepository カートRepository
   */
  constructor(
    @inject(TYPES.IOrderRepository)
    private readonly orderRepository: IOrderRepository,

    @inject(TYPES.ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  /**
   * 商品の購入を確定する
   *
   * 購入成功後、カート情報を空にする。
   *
   * @param paymentMethodId 支払い方法ID
   * @param items カート内の商品一覧
   * @returns 購入結果
   */
  async purchase(
    paymentMethodId: string,
    items: CartItem[],
  ): Promise<PurchaseResponse> {
    const normalizedPaymentMethodId =
      paymentMethodId.trim();

    if (!normalizedPaymentMethodId) {
      throw new Error(
        "支払い方法を選択してください。",
      );
    }

    if (items.length === 0) {
      throw new Error(
        "カートに商品がありません。",
      );
    }

    items.forEach((item) => {
      if (!item.productUuid.trim()) {
        throw new Error(
          "商品UUIDが指定されていません。",
        );
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        throw new Error(
          "購入数量は1以上の整数で指定してください。",
        );
      }

      if (item.quantity > item.stock) {
        throw new Error(
          `商品「${item.productName}」の数量が在庫数を超えています。`,
        );
      }
    });

    const purchaseRequest: PurchaseRequest = {
      paymentMethodId: normalizedPaymentMethodId,
      items: items.map((item) => ({
        productUuid: item.productUuid.trim(),
        quantity: item.quantity,
      })),
    };

    /*
     * 商品購入APIを呼び出す
     */
    const purchaseResponse =
      await this.orderRepository.purchase(
        purchaseRequest,
      );

    /*
     * APIが成功した後にカートを空にする
     */
    this.cartRepository.saveItems([]);

    return purchaseResponse;
  }
}