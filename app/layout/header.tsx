"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { PencilRuler, ShoppingCart } from "lucide-react";
import { useLogout } from "@/hooks/auth/useLogout";

type HeaderProps = {
  isLogin?: boolean;
};

export default function Header({ isLogin = true }: HeaderProps) {
  const { logout } = useLogout();

  return (
    <header className="flex items-center  bg-tertiary py-4 text-primary">
      <div
        className="px-4 font-bold"
        onClick={() => (window.location.href = "/")}
      >
        <PencilRuler className="inline-block mr-2" />
        <span className="px-1 py-1">フルネス文具</span>
      </div>

      <nav className="px-4">
        {/* 常時表示。押せば飛ぶリンク/ */}
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

      <div className="ml-auto px-4 font-bold flex items-center gap-4">
        {/* カートマーク　常時表示 右寄せ */}
        <div className="ml-auto">
          <Link href="/purchase/input">
            <ShoppingCart />
          </Link>
        </div>

        {/* アカウント登録 ログアウト時のみ */}
        {!isLogin && (
          <Link
            href="/account/form"
            className="text-primary rounded-md px-2 py-1 hover:text-primary/80"
          >
            アカウント登録
          </Link>
        )}

        {/* ログインボタン　ログアウト時のみ表示 */}
        {!isLogin && (
          <Link
            href="/login"
            className="text-primary rounded-md px-2 py-1 hover:text-primary/80"
          >
            ログイン
          </Link>
        )}

        {/* ログインボタン　ログアウト時のみ表示 */}
        {isLogin && (
          <Link
            href="/purchase/history"
            className="text-primary rounded-md px-2 py-1 hover:text-primary/80"
          >
            購入履歴
          </Link>
        )}

        {/* ログアウトボタン　ログイン時のみ表示 */}
        {isLogin && (
          <button
            className="text-primary rounded-md px-2 py-1 hover:text-primary/80"
            onClick={logout}
          >
            ログアウト
          </button>
        )}
      </div>
    </header>
  );
}
