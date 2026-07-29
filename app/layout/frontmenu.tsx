"use client";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "./header";
import Footer from "./footer";

export default function FrontMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { status } = useSession();

  const isLoginPage = pathname === "/login";
  const showHeaderControls = status === "authenticated" && !isLoginPage;
  // const showHeaderControls = true; // 開発中は常にヘッダーのコントロールを表示する

  return (
  <>
    <Header isLogin={showHeaderControls} />
    <main className="flex-1 container mx-auto md:p-4">
      {children}
    </main>
    <Footer isLogin={showHeaderControls} />
  </>
);
}
