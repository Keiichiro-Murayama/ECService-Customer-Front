/**
 * 顧客アカウント登録結果を表すモデル
 * POST /api/customer/accounts で返されるレスポンスの型
 */
export interface CustomerAccountRegistrationResponse {
  /** 登録された顧客のUUID */
  customerUuid: string;

  /** 登録結果のメッセージ */
  message: string;
}