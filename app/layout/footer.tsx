"use client";

import Link from "next/link";
import { useLogout } from "@/hooks/auth/useLogout";

type FooterProps = {
  isLogin?: boolean;
};

export default function Footer({ isLogin = false }: FooterProps) {
  const { logout } = useLogout();

  return (
    <footer className="bg-tertiary py-10 text-primary">
      <div className="mx-auto grid max-w-6xl gap-8 px-6">
        <div>
          <h2 className="mb-4 text-2xl font-bold">フルネス文具</h2>

          <ul className="space-y-2 text-sm font-medium">
            {/* 常時表示 */}
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-primary/70"
              >
                »トップ
              </Link>
            </li>

            <li>
              <Link
                href="/products/search"
                className="transition-colors hover:text-primary/70"
              >
                »商品検索
              </Link>
            </li>

            <li>
              <Link
                href="/purchase/input"
                className="transition-colors hover:text-primary/70"
              >
                »買い物かご
              </Link>
            </li>

            {/* ログアウト中のみ表示 */}
            {!isLogin && (
              <>
                <li>
                  <Link
                    href="/account/form"
                    className="transition-colors hover:text-primary/70"
                  >
                    »アカウント登録
                  </Link>
                </li>

                <li>
                  <Link
                    href="/login"
                    className="transition-colors hover:text-primary/70"
                  >
                    »ログイン
                  </Link>
                </li>
              </>
            )}

            {/* ログイン中のみ表示 */}
            {isLogin && (
              <>
                <li>
                  <Link
                    href="/purchase/history"
                    className="transition-colors hover:text-primary/70"
                  >
                    »購入履歴
                  </Link>
                </li>

                <li>
                  <button
                    onClick={logout}
                    className="transition-colors hover:text-primary/70"
                  >
                    »ログアウト
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        <p className="text-center text-sm font-bold">
          Fullness Stationery &copy; All rights reserved.
        </p>
      </div>
    </footer>
  );
}