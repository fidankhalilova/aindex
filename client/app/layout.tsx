import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/layout/RootLayout/Header";
import Footer from "@/layout/RootLayout/Footer";
import { AuthProvider } from "@/context/AuthProvider";
import UseQueryProvider from "@/providers/UseQuery";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AIndex — Discover & Compare AI Tools",
    template: "%s | AIndex",
  },
  description:
    "AIndex is your centralized platform for discovering, exploring, and comparing AI tools. Find the perfect tool for your specific needs.",
  keywords: [
    "AI tools",
    "artificial intelligence",
    "tool comparison",
    "AI directory",
  ],
  openGraph: {
    type: "website",
    siteName: "AIndex",
    title: "AIndex — Discover & Compare AI Tools",
    description: "Find and compare the best AI tools for your needs.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${syne.variable}`}>
      <body className="font-sans antialiased">
        <UseQueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  fontFamily: "var(--font-outfit)",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#1B1464",
                  border: "1px solid rgba(27,20,100,0.1)",
                  boxShadow: "0 4px 24px rgba(27,20,100,0.1)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                },
                success: {
                  iconTheme: { primary: "#00C2CB", secondary: "#fff" },
                },
                error: {
                  iconTheme: { primary: "#EF4444", secondary: "#fff" },
                },
              }}
            />
          </AuthProvider>
        </UseQueryProvider>
      </body>
    </html>
  );
}
