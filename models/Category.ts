/**
 * カテゴリを表すモデル
 * GET /api/customer/categories で取得されるカテゴリ配列の一つ分の型
 */
export interface Category {
  /** カテゴリのUUID */
  categoryUuid: string;

  /** カテゴリ名 */
  name: string;
}