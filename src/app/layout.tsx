import { ReactNode } from "react";

import type { Metadata } from "next";
import { Mulish } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { getPreference } from "@/server/server-actions";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES, type ThemePreset, type ThemeMode } from "@/types/preferences/theme";

import "./globals.css";

const mulish = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className="light"
      suppressHydrationWarning
    >
      <body className={`${mulish.className} min-h-screen antialiased transition-colors duration-300`}>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
