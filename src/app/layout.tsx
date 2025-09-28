import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/lib/query-client";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Legali - Your First AI-Law Firm",
    template: "%s | Legali",
  },
  description:
    "Legali helps you build cases, organize evidence, draft documents, spot legal risks, connect with affordable attorneys, and even crowdfund litigation—all on a secure, AI-driven platform.",
  keywords: [
    "legal AI",
    "law firm",
    "legal technology",
    "case building",
    "evidence organization",
    "document drafting",
    "legal risks",
    "attorney connection",
    "litigation funding",
    "legal platform",
    "justice",
    "legal assistance",
    "AI lawyer",
    "legal automation",
    "smart legal tools",
  ],
  authors: [{ name: "Legali Team" }],
  creator: "Legali",
  publisher: "Legali",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://legali.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Legali",
    title: "Legali - Your First AI-Law Firm",
    description:
      "Legali helps you build cases, organize evidence, draft documents, spot legal risks, connect with affordable attorneys, and even crowdfund litigation—all on a secure, AI-driven platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Legali - Your First AI-Law Firm",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legali - Your First AI-Law Firm",
    description:
      "Legali helps you build cases, organize evidence, draft documents, spot legal risks, connect with affordable attorneys, and even crowdfund litigation—all on a secure, AI-driven platform.",
    images: ["/og-image.jpg"],
    creator: "@legali",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${inter.className} overflow-x-hidden overflow-y-auto bg-brand-gray-50 antialiased`}
        suppressHydrationWarning={true}>
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-sky-blue-500 focus:px-4 focus:py-2 focus:text-white focus:ring-2 focus:ring-sky-blue-500 focus:ring-offset-2 focus:outline-none">
          Skip to main content
        </a>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
