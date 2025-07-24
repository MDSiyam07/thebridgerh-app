import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TheBridge RH - Gestion de candidatures",
  description: "Plateforme de gestion de candidatures pour TheBridge RH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
