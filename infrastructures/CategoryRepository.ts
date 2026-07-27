import { injectable } from "inversify";

import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { Category } from "@/models/Category";

/**
 * APIから返されるエラーレスポンス
 */
type ErrorResponse = {
  message?: string;
};

/**
 * カテゴリに関するデータアクセスを行うRepository
 */
@injectable()
export class CategoryRepository implements ICategoryRepository {
  /**
   * カテゴリ一覧取得APIのエンドポイント
   * Next.jsのAPIプロキシを経由して顧客側APIへアクセスする
   */
  private readonly endpoint = "/proxy-api/categories";

  /**
   * カテゴリ一覧を取得する
   * @returns カテゴリ一覧
   */
  async getAllCategories(): Promise<Category[]> {
    const response = await fetch(this.endpoint, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as ErrorResponse;

      throw new Error(
        errorData.message ??
          `カテゴリの取得に失敗しました。(status: ${response.status})`,
      );
    }

    const data = (await response.json()) as unknown;

    if (!Array.isArray(data)) {
      console.error("カテゴリ一覧取得APIのレスポンス:", data);

      throw new Error(
        "カテゴリ一覧取得APIのレスポンス形式が不正です。",
      );
    }

    return data as Category[];
  }
}
