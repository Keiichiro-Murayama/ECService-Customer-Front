import { useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  signIn,
  getSession,
} from "next-auth/react";

/**
 * ログインフォームの状態とロジックを管理するカスタムフック
 *
 * ログインはAuth.jsのsignIn(Credentialsプロバイダ)で行う。
 * signInは内部でauth.tsのauthorizeを実行し、
 * その中でC#のログインAPIへリクエストする。
 */
export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * 購入確認画面などから遷移してきた場合の戻り先
   *
   * callbackUrlがない通常ログインの場合は、
   * トップページへ遷移する。
   */
  const requestedCallbackUrl =
    searchParams.get("callbackUrl");

  /**
   * 外部URLへの不正なリダイレクトを防ぐため、
   * アプリ内のパスだけを許可する。
   */
  const callbackUrl =
    requestedCallbackUrl?.startsWith("/") &&
      !requestedCallbackUrl.startsWith("//")
      ? requestedCallbackUrl
      : "/";

  // 入力値
  const [mailAddress, setMailAddress] =
    useState<string>("");

  const [password, setPassword] =
    useState<string>("");

  // 補助状態
  const [submitting, setSubmitting] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * ログインを実行する
   */
  const submit = async (): Promise<void> => {
    setError(null);

    /*
     * メールアドレスの必須チェック
     */
    if (!mailAddress.trim()) {
      setError(
        "メールアドレスを入力してください。",
      );

      return;
    }

    /*
     * パスワードの必須チェック
     */
    if (!password.trim()) {
      setError(
        "パスワードを入力してください。",
      );

      return;
    }

    /*
     * メールアドレスの形式チェック
     */
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(mailAddress)) {
      setError(
        "メールアドレスの形式が正しくありません。",
      );

      return;
    }

    /*
     * パスワードの文字数チェック
     */
    if (
      password.length < 5 ||
      password.length > 20
    ) {
      setError(
        "パスワードは5〜20文字で入力してください。",
      );

      return;
    }

    setSubmitting(true);

    try {
      const result = await signIn(
        "credentials",
        {
          emailAddress: mailAddress,
          password,
          redirect: false,
        },
      );

      if (!result || result.error) {
        if (
          result?.error ===
          "AUTH_BACKEND_UNAVAILABLE"
        ) {
          setError(
            "現在ログインサーバーに接続できません。時間をおいて再度お試しください。",
          );

          return;
        }

        setError(
          "メールアドレスまたはパスワードが正しくありません。",
        );

        return;
      }

      /*
       * NextAuthセッションからJWTを取得する
       */
      const session = await getSession();

      if (session?.user) {
        const tokenValue = (
          session.user as {
            token?: unknown;
          }
        ).token;

        if (
          typeof tokenValue === "string" &&
          tokenValue.trim() !== ""
        ) {
          document.cookie =
            `access_token=${tokenValue}; ` +
            "path=/; SameSite=Lax";
        }
      }

      /*
       * callbackUrlがある場合はその画面へ戻る。
       * 通常ログインの場合はトップページへ移動する。
       */
      router.push(callbackUrl);
      router.refresh();
    } catch (cause: unknown) {
      console.error(
        "ログインエラー:",
        cause,
      );

      setError(
        "ログインに失敗しました。しばらくしてからお試しください。",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    mailAddress,
    setMailAddress,
    password,
    setPassword,
    submitting,
    error,
    submit,
  };
}