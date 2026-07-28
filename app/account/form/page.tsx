// app/account/register/page.tsx
"use client";

import { useRegisterCustomerAccount } from "@/hooks/account/useRegisterCustomerAccount";
import CustomerAccountRegisterForm from "@/components/api/account/CustomerAccountRegisterForm";
import AccountRegisterConfirm from "@/components/api/account/AccountRegisterConfirm";
import AccountRegisterComplete from "@/components/api/account/AccountRegisterComplete";

export default function AccountRegisterPage() {
  const {
    customerAccountRegistration,
    isLoading,
    error,
    isSuccess, // バリデーション通過フラグ
    isComplete, // サービス通信完了フラグ
    handleConfirm, // バリデーション実行
    handleBack, // 入力画面に戻る
    handleRegister, // サービス呼び出し（本登録）
    handleChange,
  } = useRegisterCustomerAccount();

  // 入力画面で「確認画面へ」を押したとき
  const handleGoToConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleConfirm();
  };

  // 1. 登録完了画面
  if (isComplete) {
    return <AccountRegisterComplete />;
  }

  // 2. 確認画面
  if (isSuccess) {
    return (
      <div className="mx-auto max-w-3xl items-center justify-center py-10">
        <AccountRegisterConfirm
          data={customerAccountRegistration}
          isLoading={isLoading}
          error={error} // サーバーエラーがあれば確認画面に表示可能
          onBack={handleBack}
          onConfirm={handleRegister} // フックで拡張した関数を叩く
        />
      </div>
    );
  }

  // 3. 初期入力画面
  return (
    <div className="mx-auto max-w-3xl items-center justify-center py-10">
      <CustomerAccountRegisterForm
        data={customerAccountRegistration}
        error={error}
        onChange={handleChange}
        onSubmit={handleGoToConfirm}
      />
    </div>
  );
}
