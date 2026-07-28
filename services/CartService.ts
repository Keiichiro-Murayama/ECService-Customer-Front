import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type { ICartRepository } from "@/interfaces/ICartRepository";
import type { ICartService } from "@/interfaces/ICartService";
import type { CartItem } from "@/models/CartItem";

/**
 * カート内の商品操作を担当するService
 */
@injectable()
export class CartService implements ICartService {
  constructor(
    @inject(TYPES.ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  /**
   * カート内の商品一覧を取得する
   */
  getItems(): CartItem[] {
    return this.cartRepository.getItems();
  }

  /**
   * 商品の数量を変更する
   */
  updateQuantity(
    productUuid: string,
    quantity: number,
  ): CartItem[] {
    const normalizedProductUuid = productUuid.trim();

    if (!normalizedProductUuid) {
      throw new Error("商品UUIDが指定されていません。");
    }

    const currentItems = this.cartRepository.getItems();

    const targetItem = currentItems.find(
      (item) =>
        item.productUuid === normalizedProductUuid,
    );

    if (!targetItem) {
      throw new Error(
        "変更対象の商品がカートにありません。",
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new Error(
        "数量は1以上の整数で指定してください。",
      );
    }

    if (quantity > targetItem.stock) {
      throw new Error(
        `選択できる数量は${targetItem.stock}までです。`,
      );
    }

    const updatedItems = currentItems.map((item) =>
      item.productUuid === normalizedProductUuid
        ? {
            ...item,
            quantity,
          }
        : item,
    );

    this.cartRepository.saveItems(updatedItems);

    return updatedItems;
  }

  /**
   * カートから商品を削除する
   */
  removeItem(productUuid: string): CartItem[] {
    const normalizedProductUuid = productUuid.trim();

    if (!normalizedProductUuid) {
      throw new Error("商品UUIDが指定されていません。");
    }

    const currentItems = this.cartRepository.getItems();

    const updatedItems = currentItems.filter(
      (item) =>
        item.productUuid !== normalizedProductUuid,
    );

    this.cartRepository.saveItems(updatedItems);

    return updatedItems;
  }

  /**
   * カート内商品の合計金額を計算する
   */
  calculateTotal(items: CartItem[]): number {
    return items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0,
    );
  }
}