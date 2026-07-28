import type { Category } from "@/models/Category";

/**
 * カテゴリRepositoryのインターフェイス
 */
export interface ICategoryRepository {
  /**
   * カテゴリ一覧を取得する
   * @returns カテゴリ一覧
   */
  getAllCategories(): Promise<Category[]>;
}
