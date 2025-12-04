import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Электронный журнал",
  description: "Современная система учета успеваемости студентов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="liquid-background" />
        {children}
      </body>
    </html>
  );
}
