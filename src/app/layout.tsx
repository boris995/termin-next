import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ToastFromSearchParams } from "@/components/ui/ToastFromSearchParams";
import { ToastProvider } from "@/components/ui/ToastProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Termin liga",
  description: "Moderna aplikacija za fudbalsku ligu, rezultate, tabelu i administraciju."
};

const themeScript = `
  try {
    const storageKey = "termin-theme";
    const savedTheme = window.localStorage.getItem(storageKey);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : systemTheme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr-Latn" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}>
        <ToastProvider>
          <Suspense fallback={null}>
            <ToastFromSearchParams />
          </Suspense>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-128px)] max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
