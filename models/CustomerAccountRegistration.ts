/**
 * 顧客アカウント登録情報を表すモデル
 * POST /api/customer/accounts のリクエストに対応する型
 */
export interface CustomerAccountRegistration {
  /** 氏名 */
  name: string;

  /** 氏名カナ */
  nameKana: string;

  /** 住所1 */
  address1: string;

  /** 住所2 */
  address2: string;

  /** 電話番号 */
  phoneNumber: string;

  /** メールアドレス */
  mailAddress: string;

  /** アカウント名 */
  accountName: string;

  /** パスワード */
  password: string;
}