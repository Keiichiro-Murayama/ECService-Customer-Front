import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * バックエンドAPIのベースURL
 *
 * Azure VM上では、Nginxを経由せずASP.NETへ直接接続する。
 */
const backendApiUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:5001";

/**
 * Next.jsからASP.NET APIへリクエストを中継する
 *
 * @param request フロントエンドからのリクエスト
 * @param context 動的ルートの情報
 * @returns バックエンドAPIのレスポンス
 */
const proxyRequest = async (
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
): Promise<NextResponse> => {
  const { path } = await context.params;

  const firstPath = path[0];

  /**
   * 顧客アカウント登録
   *
   * POST /proxy-api/accounts
   *   ↓
   * POST /api/customer/accounts
   *
   * 認証不要
   */
  const isAccountRegistration =
    request.method === "POST" && path.length === 1 && firstPath === "accounts";

  /**
   * 商品検索・商品詳細取得
   *
   * GET /proxy-api/products
   * GET /proxy-api/products/{productUuid}
   *
   * 認証不要
   */
  const isProductRequest = request.method === "GET" && firstPath === "products";

  /**
   * カテゴリ一覧取得
   *
   * GET /proxy-api/categories
   *
   * 認証不要
   */
  const isCategoryRequest =
    request.method === "GET" && firstPath === "categories";

  /**
   * 認証不要のAPI
   *
   * ordersはここに含めないため、
   * 購入確定と購入履歴は認証必須になる。
   */
  const isPublicRequest =
    isAccountRegistration || isProductRequest || isCategoryRequest;

  /**
   * NextAuthのセッションCookieから
   * JWTに保存されている情報を取得する
   */
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  /**
   * auth.tsで保存した
   * ASP.NET用のJWTを取得する
   */
  const accessToken = nextAuthToken?.token;

  /**
   * 公開API以外は認証必須
   *
   * 例：
   * POST /proxy-api/orders
   * GET  /proxy-api/orders
   */
  if (
    !isPublicRequest &&
    (typeof accessToken !== "string" || accessToken.trim() === "")
  ) {
    return NextResponse.json(
      {
        message: "認証情報を取得できません。再度ログインしてください。",
      },
      {
        status: 401,
      },
    );
  }

  /**
   * 転送先URLを作成する
   *
   * /proxy-api/products
   *        ↓
   * /api/customer/products
   */
  const backendUrl = new URL(`/api/customer/${path.join("/")}`, backendApiUrl);

  /**
   * categoryUuidなどの
   * クエリパラメータを引き継ぐ
   */
  backendUrl.search = request.nextUrl.search;

  const headers = new Headers();

  /**
   * Content-Typeを引き継ぐ
   */
  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  /**
   * Acceptを引き継ぐ
   */
  const accept = request.headers.get("accept");

  if (accept) {
    headers.set("Accept", accept);
  }

  /**
   * 認証必須APIにだけ
   * Bearerトークンを付ける
   */
  if (
    !isPublicRequest &&
    typeof accessToken === "string" &&
    accessToken.trim() !== ""
  ) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  /**
   * GETとHEAD以外は
   * リクエストボディを転送する
   */
  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  try {
    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });

    const responseHeaders = new Headers();

    /**
     * バックエンドから返された
     * Content-Typeを引き継ぐ
     */
    const responseContentType = backendResponse.headers.get("content-type");

    if (responseContentType) {
      responseHeaders.set("Content-Type", responseContentType);
    }

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("バックエンドAPIへの接続に失敗しました。", error);

    return NextResponse.json(
      {
        message: "バックエンドAPIとの通信に失敗しました。",
      },
      {
        status: 502,
      },
    );
  }
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
