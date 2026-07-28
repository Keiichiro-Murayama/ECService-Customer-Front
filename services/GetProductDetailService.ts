import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type { IGetProductDetailService } from "@/interfaces/IGetProductDetailService";
import type { IProductRepository } from "@/interfaces/IProductRepository";
import type { ProductDetail } from "@/models/ProductDetail";

/**
 * 商品詳細取得処理を担当するService
 */
@injectable()
export class GetProductDetailService
  implements IGetProductDetailService
{
  /**
   * コンストラクタ
   *
   * @param productRepository 商品Repository
   */
  constructor(
    @inject(TYPES.IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  /**
   * 商品UUIDを指定して商品詳細を取得する
   *
   * @param productUuid 商品UUID
   * @returns 商品詳細
   */
  async getProductDetail(
    productUuid: string,
  ): Promise<ProductDetail> {
    const normalizedProductUuid = productUuid.trim();

    if (!normalizedProductUuid) {
      throw new Error("商品UUIDが指定されていません。");
    }

    return this.productRepository.getProductByUuid(
      normalizedProductUuid,
    );
  }
}