import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/layout/RootLayout/Header";
import Footer from "@/layout/RootLayout/Footer";
import { AuthProvider } from "@/context/AuthProvider";
import UseQueryProvider from "@/providers/UseQuery";
import ChatWidget from "@/components/ChatWidget";

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
    default: "AINavix — Discover & Compare AI Tools",
    template: "%s | AINavix",
  },
  description:
    "AINavix is your centralized platform for discovering, exploring, and comparing AI tools. Find the perfect tool for your specific needs.",
  keywords: [
    "AI tools",
    "artificial intelligence",
    "tool comparison",
    "AI directory",
    "AI software",
  ],
  authors: [{ name: "AINavix Team" }],

  // ✅ Proper Favicon / Site Icon Setup
  icons: {
    icon: [
      { url: "@/assets/ainavix_logo.png", sizes: "32x32", type: "image/png" },
      { url: "@/assets/ainavix_logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "@/assets/ainavix_logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "@/assets/ainavix_logo.png",
  },

  // Open Graph (Social Sharing)
  openGraph: {
    type: "website",
    siteName: "AINavix",
    title: "AINavix — Discover & Compare AI Tools",
    description: "Find and compare the best AI tools for your needs.",
    images: [
      {
        url: "@/assets/ainavix_logo.png",
        width: 1200,
        height: 630,
        alt: "AINavix Logo",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "AINavix — Discover & Compare AI Tools",
    description: "Find and compare the best AI tools for your needs.",
    images: ["@/assets/ainavix_logo.png"],
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
