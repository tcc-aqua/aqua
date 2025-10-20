import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/layout/DarkMode/theme-provider";
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aqua Administrativo",
  description: "Administrativo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
          <link rel="icon" href="/logo.svg" sizes="any" />
        </head>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster richColors position="top-right" theme="system" />
      </body>
    </html>
  );
}
