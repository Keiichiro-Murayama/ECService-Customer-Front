"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { PencilRuler, ShoppingCart } from "lucide-react";
import { useLogout } from "@/hooks/auth/useLogout";

type HeaderProps = {
  isLogin?: boolean;
};

export default function Header({ isLogin = false }: HeaderProps) {
  const { logout } = useLogout();

  return (
    <header className="flex items-center bg-tertiary py-4 text-primary">
      {/* ロゴ */}
      <div
        className="px-4 font-bold cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <PencilRuler className="inline-block mr-2" />
        <span className="px-1 py-1">フルネス文具</span>
      </div>

      {/* 商品検索 */}
      <nav className="px-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/products/search">商品検索</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* 右側メニュー */}
      <div className="ml-auto flex items-center gap-4 px-4">
        {/* カートは常時表示 */}
        <Link href="/purchase/input">
          <ShoppingCart />
        </Link>

        {/* ===== ログアウト中のみ ===== */}
        {!isLogin && (
          <>
            <Link
              href="/account/form"
              className="rounded-md px-2 py-1 hover:text-primary/80"
            >
              アカウント登録
            </Link>

            <Link
              href="/login"
              className="rounded-md px-2 py-1 hover:text-primary/80"
            >
              ログイン
            </Link>
          </>
        )}

        {/* ===== ログイン中のみ ===== */}
        {isLogin && (
          <>
            <Link
              href="/purchase/history"
              className="rounded-md px-2 py-1 hover:text-primary/80"
            >
              購入履歴
            </Link>

            <button
              onClick={logout}
              className="rounded-md px-2 py-1 hover:text-primary/80"
            >
              ログアウト
            </button>
          </>
        )}
      </div>
    </header>
  );
}
