// hooks/account/useRegisterCustomerAccount.ts
"use client";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { IRegisterCustomerAccountService } from "@/interfaces/IRegisterCustomerAccountService";
import { CustomerAccountRegistration } from "@/models/CustomerAccountRegistration";
import { useState, useCallback } from "react";

const INITIAL_FORM: CustomerAccountRegistration = {
  name: "",
  nameKana: "",
  address1: "",
  address2: "",
  phoneNumber: "",
  mailAddress: "",
  accountName: "",
  password: "",
};

const NAME_REGEX = /^[A-Za-z0-9ぁ-んァ-ヶ一-龥々ー\s ]+$/;
const KANA_REGEX = /^[ァ-ヶー\s ]+$/;
const PHONE_REGEX = /^\d{2,3}-\d{4}-\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALNUM_REGEX = /^[A-Za-z0-9]+$/;

export const useRegisterCustomerAccount = () => {
  const registerCustomerAccountService =
    container.get<IRegisterCustomerAccountService>(
      TYPES.IRegisterCustomerAccountService,
    );

  // --- Stateの定義 ---
  const [customerAccountRegistration, setCustomerAccountRegistration] =
    useState<CustomerAccountRegistration>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isComplete, setIsComplete] = useState(false); // 登録完了画面への遷移フラグ

  // --- 入力フォームを初期化して入力画面を表示する処理 ---
  const initializeForm = () => {
    setCustomerAccountRegistration(INITIAL_FORM);
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
    setIsComplete(false);
  };

  // --- 入力の変更イベント ---
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof CustomerAccountRegistration;

    setCustomerAccountRegistration((prev) => ({
      ...prev,
      [key]: value,
    }));

    // 入力した項目のエラーを消す
    setError(null);
  }, []);

  // --- バリデーションチェック ---
  const validateForm = useCallback(() => {
    const form = customerAccountRegistration;
    const errors: string[] = [];

    // 氏名
    if (!form.name.trim()) {
      errors.push("氏名を入力してください");
    } else {
      if (form.name.length < 2 || form.name.length > 20) {
        errors.push("氏名は2〜20文字で入力してください");
      }
      if (!NAME_REGEX.test(form.name)) {
        errors.push("氏名は全角半角英数字で入力してください");
      }
    }

    // 氏名カナ
    if (!form.nameKana.trim()) {
      errors.push("氏名カナを入力してください");
    } else {
      if (form.nameKana.length < 2 || form.nameKana.length > 20) {
        errors.push("氏名カナは2〜20文字で入力してください");
      }
      if (!KANA_REGEX.test(form.nameKana)) {
        errors.push("氏名カナは全角カナで入力してください");
      }
    }

    // 住所1
    if (!form.address1.trim()) {
      errors.push("住所1を入力してください");
    } else if (form.address1.length > 100) {
      errors.push("住所1は100文字以内で入力してください");
    }

    // 住所2
    if (form.address2.length > 100) {
      errors.push("住所2は100文字以内で入力してください");
    }

    // 電話番号
    if (!form.phoneNumber.trim()) {
      errors.push("電話番号を入力してください");
    } else {
      if (form.phoneNumber.length > 14) {
        errors.push("電話番号は14文字以内で入力してください");
      }
      if (!PHONE_REGEX.test(form.phoneNumber)) {
        errors.push("電話番号は「XX-XXXX-XXXX」形式で入力してください");
      }
    }

    // メールアドレス
    if (!form.mailAddress.trim()) {
      errors.push("メールアドレスを入力してください");
    } else {
      if (form.mailAddress.length < 4 || form.mailAddress.length > 100) {
        errors.push("メールアドレスは4〜100文字で入力してください");
      }
      if (!EMAIL_REGEX.test(form.mailAddress)) {
        errors.push("正しいメールアドレス形式で入力してください");
      }
    }

    // アカウント名
    if (!form.accountName.trim()) {
      errors.push("アカウント名を入力してください");
    } else {
      if (form.accountName.length < 5 || form.accountName.length > 20) {
        errors.push("アカウント名は5〜20文字で入力してください");
      }
      if (!ALNUM_REGEX.test(form.accountName)) {
        errors.push("アカウント名は半角英数字で入力してください");
      }
    }

    // パスワード
    if (!form.password.trim()) {
      errors.push("パスワードを入力してください");
    } else {
      if (form.password.length < 5 || form.password.length > 20) {
        errors.push("パスワードは5〜20文字で入力してください");
      }
      if (!ALNUM_REGEX.test(form.password)) {
        errors.push("パスワードは半角英数字で入力してください");
      }
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return false;
    }

    setError(null);
    return true;
  }, [customerAccountRegistration]);

  // --- 確認画面へ進む前の処理 ---
  const handleConfirm = useCallback(() => {
    const isValid = validateForm();
    if (!isValid) {
      setIsSuccess(false);
      return false;
    }
    setIsSuccess(true);
    return true;
  }, [validateForm]);

  // --- 確認画面から入力画面へ戻る処理 ---
  const handleBack = useCallback(() => {
    setIsSuccess(false);
    setError(null);
    setIsComplete(false);
  }, []);

  // --- 注入されたサービスを呼び出して本登録を行う処理 ---
  const handleRegister = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // DIコンテナから取得したサービスメソッドを実行
      await registerCustomerAccountService.registerCustomerAccount(
        customerAccountRegistration,
      );
      setIsComplete(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("登録処理中にエラーが発生しました。");
      }
    }
  }, [registerCustomerAccountService, customerAccountRegistration]);

  return {
    customerAccountRegistration,
    isLoading,
    error,
    isSuccess,
    isComplete,
    initializeForm,
    handleConfirm,
    handleBack,
    handleRegister,
    handleChange,
    setCustomerAccountRegistration,
    setIsLoading,
    setError,
    setIsSuccess,
    setIsComplete,
  };
};
