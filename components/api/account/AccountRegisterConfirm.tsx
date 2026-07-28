// app/account/register/_components/AccountRegisterConfirm.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CustomerAccountRegistration } from "@/models/CustomerAccountRegistration";

type Props = {
  data: CustomerAccountRegistration;
  isLoading: boolean;
  error: string | null; // ★ ここを追加
  onBack: () => void;
  onConfirm: () => Promise<void> | void; // Promise型も許容するように調整
};

export default function AccountRegisterConfirm({
  data,
  isLoading,
  error,
  onBack,
  onConfirm,
}: Props) {
  return (
    <Card className="p-6">
      <div className="space-y-1.5 py-4 text-center">
        <h1 className="text-2xl font-bold">入力内容の確認</h1>
      </div>

      {/* ★ サーバー送信エラーがあれば表示する領域を追加 */}
      {error && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <ul className="list-disc space-y-1 pl-5">
            {error.split("\n").map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4 py-4 border-b">
        <div className="grid grid-cols-3 gap-2 border-b pb-2">
          <span className="font-semibold text-sm text-muted-foreground">
            氏名
          </span>
          <span className="col-span-2 text-sm">{data.name}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 border-b pb-2">
          <span className="font-semibold text-sm text-muted-foreground">
            氏名カナ
          </span>
          <span className="col-span-2 text-sm">{data.nameKana}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 border-b pb-2">
          <span className="font-semibold text-sm text-muted-foreground">
            住所１
          </span>
          <span className="col-span-2 text-sm">{data.address1}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 border-b pb-2">
          <span className="font-semibold text-sm text-muted-foreground">
            住所２
          </span>
          <span className="col-span-2 text-sm">{data.address2 || "—"}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 border-b pb-2">
          <span className="font-semibold text-sm text-muted-foreground">
            電話番号
          </span>
          <span className="col-span-2 text-sm">{data.phoneNumber}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 border-b pb-2">
          <span className="font-semibold text-sm text-muted-foreground">
            メールアドレス
          </span>
          <span className="col-span-2 text-sm">{data.mailAddress}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 border-b pb-2">
          <span className="font-semibold text-sm text-muted-foreground">
            アカウント名
          </span>
          <span className="col-span-2 text-sm">{data.accountName}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pb-2">
          <span className="font-semibold text-sm text-muted-foreground">
            パスワード
          </span>
          <span className="col-span-2 text-sm">********</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={isLoading}
        >
          修正する
        </Button>
        <Button type="button" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "登録中..." : "この内容で登録する"}
        </Button>
      </div>
    </Card>
  );
}
