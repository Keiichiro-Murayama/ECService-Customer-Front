import type { ProductDetail } from "@/models/ProductDetail";

/**
 * 商品詳細取得Serviceのインターフェース
 */
export interface IGetProductDetailService {
  /**
   * 商品UUIDを指定して商品詳細を取得する
   *
   * @param productUuid 商品UUID
   * @returns 商品詳細
   */
  getProductDetail(productUuid: string): Promise<ProductDetail>;
}