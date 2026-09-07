import Link from "next/link";

const LINKS = [
  { href: "/itens", label: "Itens" },
  { href: "/categorias", label: "Categorias" },
  { href: "/busca", label: "Buscar" },
  { href: "/minhas-trocas", label: "Minhas trocas" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-reuse-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-reuse-800">
          <span className="text-2xl">♻️</span> ReUse!
        </Link>
        <div className="hidden gap-6 text-sm font-medium text-reuse-900 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-reuse-600">
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/cadastrar-item"
          className="rounded-full bg-reuse-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-reuse-700"
        >
          + Cadastrar item
        </Link>
      </nav>
    </header>
  );
}
