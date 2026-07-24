import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { SITE_CONFIG } from "@/lib/config";
import { HERO_IMAGE } from "@/lib/data";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "Riff Events and Catering | Nairobi & Rongai, Kenya",
    template: "%s | Riff Events and Catering",
  },
  description:
    "Riff Events and Catering in Rimpa, Rongai — wedding catering, graduations, private parties, home BBQ, private chef, tents, chairs, DJ, sound systems, and MC services across Nairobi, Kenya.",
  keywords: [
    "catering Nairobi",
    "event catering Rongai",
    "wedding catering Kenya",
    "graduation party catering",
    "private chef Nairobi",
    "DJ hire Rongai",
    "tent hire Nairobi",
    "Riff Events and Catering",
    "Rimpa catering",
  ],
  authors: [{ name: SITE_CONFIG.fullName }],
  creator: SITE_CONFIG.fullName,
  publisher: SITE_CONFIG.fullName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.fullName,
    title: "Riff Events and Catering | Nairobi & Rongai, Kenya",
    description:
      "Premium catering and event services in Rimpa, Rongai. Weddings, graduations, private parties, BBQ, private chef, tents, DJ, and more.",
    images: [
      {
        url: HERO_IMAGE.src,
        width: 1920,
        height: 1080,
        alt: HERO_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riff Events and Catering | Nairobi & Rongai, Kenya",
    description:
      "Premium catering and event services in Rimpa, Rongai. Weddings, graduations, private parties, BBQ, private chef, tents, DJ, and more.",
    images: [HERO_IMAGE.src],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
