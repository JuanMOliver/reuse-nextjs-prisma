export function formatarData(data: Date | string): string {
  const d = new Date(data);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export const CONDICAO_LABEL: Record<string, string> = {
  NOVO: "Novo",
  SEMINOVO: "Seminovo",
  USADO: "Usado",
};

export const STATUS_ITEM_LABEL: Record<string, string> = {
  DISPONIVEL: "Disponível",
  RESERVADO: "Reservado",
  TROCADO: "Trocado",
};

export const STATUS_TROCA_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  ACEITA: "Aceita",
  RECUSADA: "Recusada",
  CONCLUIDA: "Concluída",
};

export const STATUS_TROCA_COLOR: Record<string, string> = {
  PENDENTE: "bg-amber-100 text-amber-800",
  ACEITA: "bg-blue-100 text-blue-800",
  RECUSADA: "bg-red-100 text-red-800",
  CONCLUIDA: "bg-reuse-100 text-reuse-800",
};
