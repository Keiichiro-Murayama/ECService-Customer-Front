import { withAuth } from "next-auth/middleware";

/**
 * ログインしていない場合は、
 * ログイン画面へリダイレクトする。
 */
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    /**
     * 購入確定画面
     *
     * 実際の画面URLに合わせて変更する。
     * 例:
     * /customer/purchase
     * /customer/checkout
     */
    "/purchase/complete/:path*",

    /**
     * 購入履歴画面
     *
     * 実際の画面URLに合わせて変更する。
     * 例:
     * /customer/orders
     * /customer/history
     */
    "/purchase/history/:path*",
  ],
};