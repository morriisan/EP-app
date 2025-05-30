import { Geist, Geist_Mono } from "next/font/google";
import "@uploadthing/react/styles.css";
import "./globals.css";
import { ImpersonationFloatingButton } from "@/components/ImpersonationFloatingButton";
import { MainNav } from "@/components/nav/MainNav";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from '@/components/Footer';
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Engel Paradis",
    template: "%s | Engel Paradis"
  },
  description: "Elegant bryllupsplanlegging og arrangementer for alle. Spesialisert på elegant, kulturelt og autentisk bryllupstradisjon.",
  keywords: [
            "wedding planning", "bryllup", "wedding", "muslim wedding", "south asian wedding", "norwegian wedding", "selskapls lokale", 
            "bryllupslokale", "bryllupslokale i oslo", "bryllupslokale i bergen", "bryllupslokale i trondheim", "bryllupslokale i stavanger", 
            "bryllupslokale i stavanger", "bryllup i norge", 
            "bryllups dekor"
          ],
  authors: [{ name: "Engel Paradis" }],
  creator: "Engel Paradis",
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: "website",
    locale: "no_NO",
    url: "https://engelparadis.com",
    title: "Engel Paradis | Elegant Wedding Planning",
    description: "Elegant bryllupsplanlegging og arrangementer for alle",
    siteName: "Engel Paradis"
  },
  alternates: {
    canonical: "https://engelparadis.com"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EventVenue",
            name: "Engel Paradis",
            description: "Elegant bryllupsplanlegging og arrangementer i Oslo.",
            url: "https://engelparadis.com",
            telephone: "+47 900 52 670",
            address: {
              "@type": "PostalAddress",
              streetAddress: "haavard martinsens vei 19",
              addressLocality: "Oslo",
              postalCode: "0978",
              addressCountry: "NO"
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 59.9309,
              longitude: 10.7676
            }
          })}
        </script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-pink-50 dark:bg-black transition-colors duration-200`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNav />
          <NextSSRPlugin 
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <main>
            {children}
          </main> 
          <Analytics />
          <SpeedInsights />
          <ImpersonationFloatingButton />
          <Toaster />
          <Footer />
        </ThemeProvider>
        
      </body>
    </html>
  );
}


