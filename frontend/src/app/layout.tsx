import type { Metadata } from "next";
import { Cormorant_Garamond, Crimson_Pro, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Merlion Brews",
  description: "Artisan Coffee Crafted with Peranakan Soul",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-SG">
      <body
        className={`${cormorantGaramond.variable} ${crimsonPro.variable} ${pinyonScript.variable} antialiased`}
      >
        <div id="skip-nav" className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:z-50 focus-within:bg-white focus-within:p-4">
          <a href="#main-content">Skip to content</a>
        </div>
        {children}
      </body>
    </html>
  );
}
