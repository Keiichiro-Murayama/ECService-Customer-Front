// app/account/register/_components/AccountRegisterComplete.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AccountRegisterComplete() {
  return (
    <Card className="p-6 text-center space-y-6">
      <div className="space-y-1.5 py-4">
        <h1 className="text-2xl font-bold text-primary">登録が完了しました</h1>
        <p className="text-sm text-muted-foreground pt-2">
          ご登録ありがとうございます。
        </p>
      </div>
      <div className="pt-4 flex  gap-2 justify-center">
        <Button
          onClick={() => (window.location.href = "/")}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          トップへ戻る
        </Button>
        <Button onClick={() => (window.location.href = "/account/login")}>
          ログイン
        </Button>
      </div>
    </Card>
  );
}
