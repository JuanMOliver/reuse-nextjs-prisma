import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ReUse! | Troca e doação de itens",
  description:
    "Plataforma web ReUse! - encontre, troque e doe itens perto de você. Desenvolvida com Next.js, Prisma ORM e PostgreSQL.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col text-reuse-900">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
