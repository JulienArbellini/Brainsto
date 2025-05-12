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
    <html lang="fr" className="dark"> {/* tu peux rendre ça dynamique ensuite */}
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}