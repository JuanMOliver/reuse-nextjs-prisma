export default function LoadingItens() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-xl2 bg-reuse-50" />
      ))}
    </div>
  );
}
