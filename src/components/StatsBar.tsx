type Stat = { label: string; value: number | string };

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl2 border border-reuse-100 bg-white p-4 text-center shadow-sm"
        >
          <p className="text-2xl font-bold text-reuse-700">{stat.value}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-reuse-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
