import { injectable } from "inversify";

import type { IProductRepository } from "@/interfaces/IProductRepository";
import type { Product } from "@/models/Product";
import type { ProductDetail } from "@/models/ProductDetail";

/**
 * APIから返されるエラーレスポンス
 */
type ErrorResponse = {
  message?: string;
};

/**
 * 商品に関するデータアクセスを行うRepository
 */
@injectable()
export class ProductRepository implements IProductRepository {
  /** 商品APIのエンドポイント */
  private readonly endpoint = "/proxy-api/products";

  /**
   * 全商品を取得する
   * @returns 商品一覧
   */
  async getAllProducts(): Promise<Product[]> {
    return await this.getProducts(this.endpoint);
  }

  /**
   * 指定したカテゴリの商品を取得する
   * @param categoryUuid カテゴリUUID
   * @returns 指定カテゴリの商品一覧
   */
  async getProductsByCategoryUuid(
    categoryUuid: string,
  ): Promise<Product[]> {
    const normalizedCategoryUuid = categoryUuid.trim();

    if (normalizedCategoryUuid.length === 0) {
      return await this.getAllProducts();
    }

    const url =
      `${this.endpoint}?categoryUuid=${encodeURIComponent(
        normalizedCategoryUuid,
      )}`;

    return await this.getProducts(url);
  }

  /**
   * 指定した商品の詳細情報を取得する
   * @param productUuid 商品UUID
   * @returns 商品詳細
   */
  async getProductByUuid(
    productUuid: string,
  ): Promise<ProductDetail> {
    const normalizedProductUuid = productUuid.trim();

    if (normalizedProductUuid.length === 0) {
      throw new Error("商品UUIDを指定してください。");
    }

    const url =
      `${this.endpoint}/info?productUuid=${encodeURIComponent(
        normalizedProductUuid,
      )}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          `商品詳細の取得に失敗しました。(status : ${response.status})`,
        ),
      );
    }

    return (await response.json()) as ProductDetail;
  }

  /**
   * 指定したURLから商品一覧を取得する
   * @param url 商品一覧取得APIのURL
   * @returns 商品一覧
   */
  private async getProducts(
    url: string,
  ): Promise<Product[]> {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          `商品の取得に失敗しました。(status : ${response.status})`,
        ),
      );
    }

    const data = (await response.json()) as unknown;

    if (!Array.isArray(data)) {
      console.error("商品取得APIのレスポンス:", data);

      throw new Error(
        "商品取得APIのレスポンス形式が不正です。",
      );
    }

    return data as Product[];
  }

  /**
   * APIのエラーレスポンスからメッセージを取得する
   * @param response APIレスポンス
   * @param fallbackMessage メッセージ取得失敗時の既定値
   * @returns エラーメッセージ
   */
  private async getErrorMessage(
    response: Response,
    fallbackMessage: string,
  ): Promise<string> {
    const errorData = (await response
      .json()
      .catch(() => ({}))) as ErrorResponse;

    return errorData.message ?? fallbackMessage;
  }
}
