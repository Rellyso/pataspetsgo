import type { Metadata } from "next";

import "@/app/globals.css";
import { ibmPlexMono, plusJakartaSans } from "@/lib/fonts";
import "@/lib/server/env";

export const metadata: Metadata = {
  title: "PatasGo",
  description: "Catalogo digital mobile-first para pedidos via WhatsApp da Patas Pets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} bg-background text-foreground antialiased`}
        style={{
          fontFamily: "var(--font-body)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
