import type { CartItem } from "@/models/CartItem";
import type { ProductDetail } from "@/models/ProductDetail";

/**
 * カート追加Serviceのインターフェース
 */
export interface IAddToCartService {
  /**
   * 商品をカートへ追加する
   *
   * @param productDetail 追加する商品詳細
   * @param quantity 追加数量
   * @returns 追加後のカート商品一覧
   */
  addToCart(
    productDetail: ProductDetail,
    quantity: number,
  ): CartItem[];
}