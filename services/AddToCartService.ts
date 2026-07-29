import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type { IAddToCartService } from "@/interfaces/IAddToCartService";
import type { ICartRepository } from "@/interfaces/ICartRepository";
import type { CartItem } from "@/models/CartItem";
import type { ProductDetail } from "@/models/ProductDetail";

/**
 * 商品をカートへ追加するService
 */
@injectable()
export class AddToCartService
  implements IAddToCartService
{
  /**
   * コンストラクタ
   *
   * @param cartRepository カートRepository
   */
  constructor(
    @inject(TYPES.ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  /**
   * 商品をカートへ追加する
   *
   * 同じ商品が既にカートへ入っている場合は、
   * 現在の数量へ追加数量を加算する。
   *
   * @param productDetail 追加する商品詳細
   * @param quantity 追加数量
   * @returns 追加後のカート商品一覧
   */
  addToCart(
    productDetail: ProductDetail,
    quantity: number,
  ): CartItem[] {
    this.validateQuantity(productDetail, quantity);

    const currentItems =
      this.cartRepository.getItems();

    const existingItemIndex =
      currentItems.findIndex(
        (item) =>
          item.productUuid ===
          productDetail.productUuid,
      );

    /*
     * カートにまだ存在しない商品の場合
     */
    if (existingItemIndex === -1) {
      const newItem: CartItem = {
        productUuid: productDetail.productUuid,
        productName: productDetail.productName,
        price: productDetail.price,
        imageUrl: productDetail.imageUrl,
        quantity,
        stock: productDetail.stock,
      };

      const updatedItems = [
        ...currentItems,
        newItem,
      ];

      this.cartRepository.saveItems(updatedItems);

      return updatedItems;
    }

    /*
     * 既にカートに存在する商品の場合
     */
    const existingItem =
      currentItems[existingItemIndex];

    const updatedQuantity =
      existingItem.quantity + quantity;

    if (updatedQuantity > productDetail.stock) {
      throw new Error(
        `選択できる数量は${productDetail.stock}までです。`,
      );
    }

    const updatedItems =
      currentItems.map((item, index) => {
        if (index !== existingItemIndex) {
          return item;
        }

        return {
          ...item,
          productName: productDetail.productName,
          price: productDetail.price,
          imageUrl: productDetail.imageUrl,
          quantity: updatedQuantity,
          stock: productDetail.stock,
        };
      });

    this.cartRepository.saveItems(updatedItems);

    return updatedItems;
  }

  /**
   * 追加数量を検証する
   *
   * @param productDetail 商品詳細
   * @param quantity 追加数量
   */
  private validateQuantity(
    productDetail: ProductDetail,
    quantity: number,
  ): void {
    if (productDetail.stock <= 0) {
      throw new Error(
        "現在この商品は在庫切れです。",
      );
    }

    if (!Number.isInteger(quantity)) {
      throw new Error(
        "数量は整数で指定してください。",
      );
    }

    if (quantity < 1) {
      throw new Error(
        "数量は1以上で指定してください。",
      );
    }

    if (quantity > productDetail.stock) {
      throw new Error(
        `選択できる数量は${productDetail.stock}までです。`,
      );
    }
  }
}