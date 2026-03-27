import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "NexanLab — Discover the Best AI Tools",
    template: "%s | NexanLab",
  },
  description:
    "Discover, compare and use the best AI tools. Curated directory of 500+ AI tools for writing, design, video, code, productivity and more.",
  keywords: [
    "AI tools",
    "artificial intelligence",
    "AI directory",
    "best AI tools",
    "AI productivity",
    "ChatGPT alternatives",
    "AI writing tools",
    "AI image generator",
    "cold email generator",
    "NexanLab",
  ],
  authors: [{ name: "NexanLab" }],
  creator: "NexanLab",
  publisher: "NexanLab",
  metadataBase: new URL("https://www.nexanlab.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.nexanlab.com",
    siteName: "NexanLab",
    title: "NexanLab — Discover the Best AI Tools",
    description:
      "Discover, compare and use the best AI tools. Curated directory of 500+ AI tools.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NexanLab — Discover the Best AI Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexanLab — Discover the Best AI Tools",
    description:
      "Discover, compare and use the best AI tools. Curated directory of 500+ AI tools.",
    images: ["/opengraph-image"],
    creator: "@nexanlab",
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
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: 'ooLbsxAGnEbLQlg_Sfd07nKPRz9T3gPCbKxANONWTy0',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="ooLbsxAGnEbLQlg_Sfd07nKPRz9T3gPCbKxANONWTy0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}