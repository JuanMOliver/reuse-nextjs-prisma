"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUsuarioDemo } from "@/lib/session";

// ------------------------------------------------------------------
// Cadastrar item
// ------------------------------------------------------------------

const cadastrarItemSchema = z.object({
  titulo: z.string().min(3, "O título precisa ter ao menos 3 caracteres."),
  descricao: z.string().min(10, "Descreva o item com um pouco mais de detalhe."),
  categoriaId: z.string().min(1, "Selecione uma categoria."),
  condicao: z.enum(["NOVO", "SEMINOVO", "USADO"]),
  cidade: z.string().min(2, "Informe a cidade."),
  bairro: z.string().optional(),
  fotoUrl: z.string().url().optional().or(z.literal("")),
});

export async function cadastrarItem(formData: FormData) {
  const parsed = cadastrarItemSchema.safeParse({
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao"),
    categoriaId: formData.get("categoriaId"),
    condicao: formData.get("condicao"),
    cidade: formData.get("cidade"),
    bairro: formData.get("bairro") || undefined,
    fotoUrl: formData.get("fotoUrl") || undefined,
  });

  if (!parsed.success) {
    const mensagem = parsed.error.issues.map((issue) => issue.message).join(" ");
    redirect(`/cadastrar-item?erro=${encodeURIComponent(mensagem)}`);
  }

  // getUsuarioDemo() usa Prisma findUnique + create (comportamento tipo "upsert"
  // manual) para garantir que sempre exista um usuário demo válido.
  const usuario = await getUsuarioDemo();

  const item = await prisma.item.create({
    data: {
      ...parsed.data,
      fotoUrl: parsed.data.fotoUrl || null,
      usuarioId: usuario.id,
    },
  });

  // Invalida o cache das páginas que listam itens, para refletir o novo cadastro.
  revalidatePath("/itens");
  revalidatePath("/");

  redirect(`/itens/${item.id}?sucesso=1`);
}

// ------------------------------------------------------------------
// Propor troca
// ------------------------------------------------------------------

const proporTrocaSchema = z.object({
  itemDesejadoId: z.string().min(1),
  itemOferecidoId: z.string().min(1, "Selecione um item para oferecer."),
  mensagem: z.string().optional(),
});

export async function proporTroca(formData: FormData) {
  const parsed = proporTrocaSchema.safeParse({
    itemDesejadoId: formData.get("itemDesejadoId"),
    itemOferecidoId: formData.get("itemOferecidoId"),
    mensagem: formData.get("mensagem") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const usuario = await getUsuarioDemo();

  await prisma.troca.create({
    data: {
      solicitanteId: usuario.id,
      itemDesejadoId: parsed.data.itemDesejadoId,
      itemOferecidoId: parsed.data.itemOferecidoId,
      mensagem: parsed.data.mensagem,
      status: "PENDENTE",
    },
  });

  revalidatePath("/minhas-trocas");
  redirect(`/minhas-trocas?sucesso=1`);
}

// ------------------------------------------------------------------
// Atualizar status de uma troca (aceitar / recusar / concluir)
// ------------------------------------------------------------------

const atualizarStatusSchema = z.object({
  trocaId: z.string().min(1),
  status: z.enum(["ACEITA", "RECUSADA", "CONCLUIDA"]),
});

export async function atualizarStatusTroca(formData: FormData) {
  const parsed = atualizarStatusSchema.safeParse({
    trocaId: formData.get("trocaId"),
    status: formData.get("status"),
  });

  if (!parsed.success) return;

  await prisma.$transaction(async (tx) => {
    const troca = await tx.troca.update({
      where: { id: parsed.data.trocaId },
      data: { status: parsed.data.status },
    });

    // Ao concluir a troca, os dois itens envolvidos passam a ficar marcados
    // como TROCADO, para não aparecerem mais na listagem pública.
    if (parsed.data.status === "CONCLUIDA") {
      await tx.item.updateMany({
        where: { id: { in: [troca.itemOferecidoId, troca.itemDesejadoId] } },
        data: { status: "TROCADO" },
      });
    }
  });

  revalidatePath("/minhas-trocas");
  revalidatePath("/itens");
}

// ------------------------------------------------------------------
// Avaliar usuário após uma troca concluída
// ------------------------------------------------------------------

const avaliarSchema = z.object({
  trocaId: z.string().min(1),
  avaliadoId: z.string().min(1),
  nota: z.coerce.number().min(1).max(5),
  comentario: z.string().optional(),
});

export async function avaliarUsuario(formData: FormData) {
  const parsed = avaliarSchema.safeParse({
    trocaId: formData.get("trocaId"),
    avaliadoId: formData.get("avaliadoId"),
    nota: formData.get("nota"),
    comentario: formData.get("comentario") || undefined,
  });

  if (!parsed.success) return;

  const usuario = await getUsuarioDemo();

  await prisma.avaliacao.create({
    data: {
      avaliadorId: usuario.id,
      avaliadoId: parsed.data.avaliadoId,
      trocaId: parsed.data.trocaId,
      nota: parsed.data.nota,
      comentario: parsed.data.comentario,
    },
  });

  revalidatePath(`/perfil/${parsed.data.avaliadoId}`);
  revalidatePath("/minhas-trocas");
}
