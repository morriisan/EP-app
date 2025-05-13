import { Geist, Geist_Mono } from "next/font/google";
import "@uploadthing/react/styles.css";
import "./globals.css";
import { ImpersonationFloatingButton } from "@/components/ImpersonationFloatingButton";
import { MainNav } from "@/components/nav/MainNav";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MainNav />
        <NextSSRPlugin 
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        {children}
        <ImpersonationFloatingButton />
        <Toaster />
      </body>
    </html>
  );
}


