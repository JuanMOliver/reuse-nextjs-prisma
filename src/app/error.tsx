"use client";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  const bancoIndisponivel = /Can't reach database server|Environment variable not found|P1001/.test(
    error.message,
  );

  return (
    <div className="rounded-xl2 bg-red-50 p-8 text-center">
      <p className="text-3xl">⚠️</p>
      <h2 className="mt-2 text-lg font-bold text-red-800">
        {bancoIndisponivel ? "Banco de dados indisponível" : "Algo deu errado"}
      </h2>
      <p className="mt-1 text-sm text-red-700">
        {bancoIndisponivel
          ? "Inicie o PostgreSQL local e tente novamente."
          : "Não foi possível carregar esta página. Tente novamente."}
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
