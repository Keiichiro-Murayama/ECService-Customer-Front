import type { Product } from "@/models/Product";
import type { ProductDetail } from "@/models/ProductDetail";

/**
 * 商品Repositoryのインターフェイス
 */
export interface IProductRepository {
  /**
   * 全商品を取得する
   * @returns 商品一覧
   */
  getAllProducts(): Promise<Product[]>;

  /**
   * 指定したカテゴリの商品を取得する
   * @param categoryUuid カテゴリUUID
   * @returns 指定カテゴリの商品一覧
   */
  getProductsByCategoryUuid(
    categoryUuid: string
  ): Promise<Product[]>;

  /**
   * 指定した商品の詳細情報を取得する
   * @param productUuid 商品UUID
   * @returns 商品詳細
   */
  getProductByUuid(
    productUuid: string
  ): Promise<ProductDetail>;
}
