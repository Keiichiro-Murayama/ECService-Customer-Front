import Link from "next/link";

const footerLinks = [
  { label: "トップ", href: "/" },
  { label: "アカウント登録", href: "/" },
  { label: "ログイン", href: "/" },
  { label: "商品検索", href: "/" },
  { label: "買い物カゴ", href: "/" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-tertiary py-10 text-primary">
      <div className="mx-auto grid max-w-6xl gap-8 px-6">
        <div>
          <h2 className="mb-4 text-2xl font-bold">フルネス文具</h2>
          <ul className="space-y-2 text-sm font-medium">
            {footerLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-primary/70"
                >
                  »{item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-sm font-bold">
          Fullness Stationery &copy; All rights reserved.
        </p>
      </div>
    </footer>
  );
}
