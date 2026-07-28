import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

/**
 * ログインフォームの状態とロジックを管理するカスタムフック
 *
 * ログインはAuth.jsのsignIn(Credentials プロバイダ)で行う。
 * signInは内部で auth.tsのauthorize を実行し、その中でC#のログインAPIへリクエストする
 *
 * ログイン成功後、バックエンドから取得した JWT を access_token Cookie に保存し、
 * 以降の API 呼び出し（/proxy-api/*）で credentials: include で自動送信される
 */
export function useLogin() {
  const router = useRouter();

  // --- 入力値の状態 ---
  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");

  // --- 補助状態 ---
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ログインを実行する
   * 入力チェック → Auth.jsのsignIn → JWT を access_token Cookie に保存 → 遷移/エラー表示
   */
  const submit = async () => {
    setError(null);

    // 入力チェック:どちらか空なら API を呼ばずに促す
    if (!mailAddress.trim()) {
      setError("メールアドレスを入力してください。");
      return;
    }
    if (!password.trim()) {
      setError("パスワードを入力してください。");
      return;
    }
    // メールアドレスの形式チェック（簡易）
    if (mailAddress) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(mailAddress)) {
        setError("メールアドレスの形式が正しくありません。");
        return;
      }
    }
    //パスワードは5-20文字の範囲であることを確認
    if (password.length < 5 || password.length > 20) {
      setError("パスワードは5〜20文字で入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      const result = await signIn("credentials", {
        emailAddress: mailAddress,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        if (result?.error === "AUTH_BACKEND_UNAVAILABLE") {
          setError(
            "現在ログインサーバーに接続できません。時間をおいて再度お試しください。",
          );
          return;
        }
        setError("メールアドレスまたはパスワードが正しくありません。");
        return;
      }

      // NextAuth セッションから JWT トークンを取得して access_token Cookie に保存
      // バックエンドは JWT Cookie ("access_token") で認証するため、
      // NextAuth が保持するトークンをブラウザの Cookie に保存する
      const session = await getSession();
      if (session?.user) {
        const tokenValue = (session.user as { token?: unknown }).token;

        if (typeof tokenValue === "string") {
          document.cookie = `access_token=${tokenValue}; path=/; SameSite=Lax`;
        }
      }

      router.push("/");
    } catch (e) {
      console.error("ログインエラー:", e);
      setError("ログインに失敗しました。しばらくしてからお試しください。");
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
