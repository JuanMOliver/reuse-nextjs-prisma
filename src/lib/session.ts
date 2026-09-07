import { prisma } from "@/lib/prisma";

/**
 * O protótipo web ainda não possui autenticação completa (login/senha).
 * Para permitir demonstrar telas como "Minhas trocas" e "Cadastrar item"
 * de forma funcional e integrada ao Prisma, usamos um usuário "demo"
 * fixo, identificado pela variável de ambiente DEMO_USER_EMAIL.
 *
 * Isso é documentado no README (seção "Limitações e próximos passos")
 * e é uma decisão consciente de escopo, não um esquecimento.
 */
export async function getUsuarioDemo() {
  const email = process.env.DEMO_USER_EMAIL ?? "ana.souza@reuse.com";

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (usuario) return usuario;

  // Caso o seed ainda não tenha rodado, cria o usuário demo em tempo real.
  return prisma.usuario.create({
    data: {
      nome: "Ana Souza",
      email,
      cidade: "São Paulo",
      bairro: "Vila Mariana",
    },
  });
}
