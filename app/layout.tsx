import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NurseAI",
    template: "%s | NurseAI"
  },
  description:
    "Assistant IA premium pour étudiants infirmiers: démarches de soins, calculs de doses, fiches, quiz et stages.",
  applicationName: "NurseAI",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/brand/apple-touch-icon.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0CC4A3"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
