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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Engel Paradis",
    template: "%s | Engel Paradis"
  },
  description: "Elegant bryllupsplanlegging og arrangementer for alle. Spesialisert på sør-asiatiske og muslimske bryllupstradisjoner.",
  keywords: ["wedding planning", "bryllup", "wedding", "muslim wedding", "south asian wedding", "norwegian wedding", "selskapls lokale", "bryllupslokale", 
    "bryllupslokale i oslo", "bryllupslokale i bergen", "bryllupslokale i trondheim", "bryllupslokale i stavanger", "bryllupslokale i oslo", "bryllupslokale i bergen", 
    "bryllupslokale i trondheim", "bryllupslokale i stavanger", "bryllup i norge", "bryllups dekor"],
  authors: [{ name: "Engel Paradis" }],
  creator: "Engel Paradis",
  openGraph: {
    type: "website",
    locale: "no_NO",
    url: "https://engelparadis.no",
    title: "Engel Paradis | Elegant Wedding Planning",
    description: "Elegant bryllupsplanlegging og arrangementer for alle",
    siteName: "Engel Paradis"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-pink-50 dark:bg-slate-900 transition-colors duration-200`}
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
          {children}
          <ImpersonationFloatingButton />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}


