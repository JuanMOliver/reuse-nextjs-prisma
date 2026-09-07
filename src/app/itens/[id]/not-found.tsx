import Link from "next/link";

export default function ItemNaoEncontrado() {
  return (
    <div className="rounded-xl2 bg-reuse-50 p-10 text-center">
      <p className="text-4xl">🔎</p>
      <h1 className="mt-3 text-xl font-bold text-reuse-900">Item não encontrado</h1>
      <p className="mt-2 text-sm text-reuse-700">
        O item que você procura pode ter sido removido ou já foi trocado.
      </p>
      <Link
        href="/itens"
        className="mt-4 inline-block rounded-full bg-reuse-600 px-4 py-2 text-sm font-semibold text-white hover:bg-reuse-700"
      >
        Ver outros itens
      </Link>
    </div>
  );
}
