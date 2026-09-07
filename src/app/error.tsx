"use client";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-xl2 bg-red-50 p-8 text-center">
      <p className="text-3xl">⚠️</p>
      <h2 className="mt-2 text-lg font-bold text-red-800">Algo deu errado</h2>
      <p className="mt-1 text-sm text-red-700">
        {error.message || "Não foi possível carregar esta página. Verifique a conexão com o banco de dados."}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Tentar novamente
      </button>
    </div>
  );
}
