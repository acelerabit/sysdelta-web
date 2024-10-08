import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextAuthSessionProvider from "@/contexts/session-context";
import { CookiesProvider } from "next-client-cookies/server";
import { UserProvider } from "@/contexts/user-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sysdelta",
  description: "Generated by acelerabit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NextAuthSessionProvider>
        <CookiesProvider>
          <UserProvider>
            <body className={inter.className}>{children}</body>
            <Toaster position="top-right" />
          </UserProvider>
        </CookiesProvider>
      </NextAuthSessionProvider>
    </html>
  );
}
