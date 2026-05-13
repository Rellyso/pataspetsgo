import type { Metadata } from "next";

import "@/app/globals.css";
import { ibmPlexMono, plusJakartaSans } from "@/lib/fonts";
import "@/lib/server/env";

export const metadata: Metadata = {
  title: "PatasGo",
  description:
    "Catálogo digital mobile-first para pedidos via WhatsApp da Patas Pets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} antialiased`}
      data-scroll-behavior="smooth"
      lang="pt-BR"
    >
      <body className="bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
