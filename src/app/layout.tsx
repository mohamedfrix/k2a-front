import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { getServerLanguage } from "../lib/server-cookies";
import { generateSiteMetadata } from "../lib/metadata";
import { isRTL } from "../lib/language";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate dynamic metadata based on the user's language
export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  return generateSiteMetadata(language);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLanguage = await getServerLanguage();
  const isLanguageRTL = isRTL(initialLanguage);

  return (
    <html lang={initialLanguage} dir={isLanguageRTL ? 'rtl' : 'ltr'}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="system">
          <LanguageProvider initialLanguage={initialLanguage}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
