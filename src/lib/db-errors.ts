/** Identifica falhas temporarias de PostgreSQL em producao. */
export function isDatabaseUnavailable(error: unknown): boolean {
  const e = error as { code?: string; message?: string; cause?: { code?: string } } | null;
  const code = e?.code ?? e?.cause?.code ?? "";
  const message = e?.message ?? "";
  return ["P1000", "P1001", "P1002", "P1003", "P1017", "P2021", "P2022"].includes(code)
    || /Can't reach database server|Environment variable not found|database server.*not running|timeout.*connect|authentication failed|relation .* does not exist/i.test(message);
}
