import type { Metadata, Viewport } from "next";
import { createSupabaseServerClient } from "@/server/supabase/server";
import "./globals.css";

type ThemeSettings = {
  dark_mode: boolean;
};

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let darkMode = false;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("settings")
        .select("dark_mode")
        .eq("user_id", user.id)
        .maybeSingle();

      const settings = data as ThemeSettings | null;
      darkMode = Boolean(settings?.dark_mode);
    }
  } catch {
    darkMode = false;
  }

  return (
    <html lang="fr" className={darkMode ? "dark" : undefined} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
