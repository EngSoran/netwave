import type {Metadata} from 'next';
import './globals.css';
import ThemeLayoutClient from "./ThemeLayoutClient";

export const metadata: Metadata = {
  title: 'NetWeave',
  description: 'حلول شبكات متقدمة',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeLayoutClient>{children}</ThemeLayoutClient>
      </body>
    </html>
  );
}
