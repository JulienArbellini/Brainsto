import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brainstorm IA",
  description: "Débats multi-agents IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}