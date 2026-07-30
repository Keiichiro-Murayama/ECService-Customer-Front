// components/auth/LoginForm.tsx
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  /** メールアドレス(入力欄の現在値) */
  mailAddress: string;
  /** パスワード(入力欄の現在値) */
  password: string;
  /** ログイン処理の実行中フラグ */
  submitting: boolean;
  /** エラーメッセージ(あれば表示する) */
  error: string | null;
  /** メールアドレス入力の変更を親へ通知する */
  onMailAddressChange: (value: string) => void;
  /** パスワード入力の変更を親へ通知する */
  onPasswordChange: (value: string) => void;
  /** 新規会員登録画面へ遷移する */
  onRegister: () => void;
  /** ログイン実行を親へ通知する */
  onSubmit: () => void;
};

/**
 * ログインフォームの見た目を担うコンポーネント
 * メールアドレス・パスワードの入力欄、ログインボタン、エラー表示を持つ
 */
export function LoginForm({
  mailAddress,
  password,
  submitting,
  error,
  onMailAddressChange,
  onPasswordChange,
  onSubmit,
  onRegister,
}: Props) {
  return (
    <div className="space-y-5">
      {/* ユーザー名 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="mailAddress">
          メールアドレス
        </label>
        <Input
          id="mailAddress"
          value={mailAddress}
          onChange={(e) => onMailAddressChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          autoComplete="email"
        />
      </div>
      {/* パスワード */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="password">
          パスワード
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          autoComplete="current-password"
        />
      </div>
      {/* エラーメッセージ */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {/* ログインボタン */}
      <Button onClick={onSubmit} disabled={submitting} className="w-full">
        <LogIn className="mr-1 h-4 w-4" />
        {submitting ? "ログイン中..." : "ログイン"}
      </Button>
      {/* 新規会員登録 */}
      <div className="border-t pt-5 text-center">
        <p className="mb-3 text-sm text-muted-foreground">
          初めてご利用の方
        </p>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onRegister}
        >
          新規会員登録はこちら
        </Button>
      </div>
    </div>

  );
}
