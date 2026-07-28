// app/account/register/_components/CustomerAccountRegisterForm.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CustomerAccountRegistration } from "@/models/CustomerAccountRegistration";

type Props = {
  data: CustomerAccountRegistration;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function CustomerAccountRegisterForm({
  data,
  error,
  onChange,
  onSubmit,
}: Props) {
  return (
    <Card className="p-6">
      <div className="space-y-1.5 py-4 text-center">
        <h1 className="text-2xl font-bold">アカウント登録</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <ul className="list-disc space-y-1 pl-5">
              {error.split("\n").map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {/* 各Inputコンポーネント (value={data.name} などを指定) */}
          <div className="space-y-2">
            <Label htmlFor="name">氏名</Label>
            <Input
              id="name"
              name="name"
              value={data.name}
              onChange={onChange}
              placeholder="山田 太郎"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameKana">氏名カナ</Label>
            <Input
              id="nameKana"
              name="nameKana"
              value={data.nameKana}
              onChange={onChange}
              placeholder="ヤマダ タロウ"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address1">住所１</Label>
            <Input
              id="address1"
              name="address1"
              value={data.address1}
              onChange={onChange}
              placeholder="東京都渋谷区1-11-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address2">住所２</Label>
            <Input
              id="address2"
              name="address2"
              value={data.address2}
              onChange={onChange}
              placeholder="マンション渋谷 101号室"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">電話番号</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={data.phoneNumber}
              onChange={onChange}
              placeholder="03-1111-1111"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mailAddress">メールアドレス</Label>
            <Input
              id="mailAddress"
              name="mailAddress"
              value={data.mailAddress}
              onChange={onChange}
              placeholder="taro@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountName">アカウント名</Label>
            <Input
              id="accountName"
              name="accountName"
              value={data.accountName}
              onChange={onChange}
              placeholder="(半角英数字)5~20文字"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={data.password}
              onChange={onChange}
              placeholder="(半角英数字)5~20文字"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => (window.location.href = "/")}
          >
            キャンセル
          </Button>
          <Button type="submit">確認</Button>
        </div>
      </form>
    </Card>
  );
}
