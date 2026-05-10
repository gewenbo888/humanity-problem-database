import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/contexts/Providers";
import Chrome from "@/components/Chrome";
import { PLATFORM_BY_ID } from "@/data/spec";
import { PLATFORM_ID } from "@/data/self";

const self = PLATFORM_BY_ID[PLATFORM_ID];
const baseURL = `https://${self.slug}.psyverse.fun`;

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),
  title: `${self.name.en} · ${self.name.zh}`,
  description: self.oneLine.en,
  keywords: [self.id, self.slug, "civlab", "civilization-scale", "AI-native", "bilingual", "psyverse"],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: { canonical: "/", languages: { en: "/", "zh-CN": "/", "x-default": "/" } },
  openGraph: {
    title: `${self.name.en} · ${self.name.zh}`,
    description: self.oneLine.en,
    url: baseURL + "/",
    siteName: "Psyverse · civlab",
    type: "website", locale: "en_US", alternateLocale: ["zh_CN"],
  },
  twitter: { card: "summary_large_image", title: `${self.name.en} · ${self.name.zh}`, description: self.oneLine.en },
  robots: { index: true, follow: true },
  other: { "theme-color": self.hue },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f6f7f7" }, { media: "(prefers-color-scheme: dark)", color: "#06070b" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("civlab.theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var dark=t?t==="dark":d;if(dark)document.documentElement.classList.add("dark");var l=localStorage.getItem("civlab.lang");if(l==="zh"||l==="en")document.documentElement.lang=l==="zh"?"zh-CN":"en";}catch(e){}})();`,
          }}
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <Chrome>{children}</Chrome>
        </Providers>
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
