"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import { AuthPanel } from "@/components/AuthPanel";

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? "border-b-2 border-pink-500" : "";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/booking", label: "Book Date" },
    ...(isAdmin ? [
      { href: "/uploader", label: "Upload" },
      { href: "/dashboard", label: "Dashboard" }
    ] : []),
    { 
      href: user ? "/myPage" : "#", 
      label: user ? "My Page" : "Login",
      component: !user ? <AuthPanel trigger={<span className="text-pink-900 hover:text-pink-700">Login</span>} /> : undefined
    },
  ];

  return (
    <header className="w-full border-b bg-white">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl text-pink-800 font-light"
        >
          Engel Paradis
        </Link>

        {/* Desktop Navigation */}
        <div className="md:flex space-x-8">
          {navLinks.map((link) => (
            link.component ? (
              <div key={link.href} onClick={(e) => e.preventDefault()}>
                {link.component}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-pink-900 hover:text-pink-700 ${isActive(link.href)}`}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-pink-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>

        {/* Mobile Navigation */}
        <div
          className={`
            absolute top-16 left-0 right-0 w-full z-50
            bg-white border-b shadow-lg md:hidden
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
          `}
        >
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              link.component ? (
                <div key={link.href} onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                }}>
                  {link.component}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-pink-900 hover:text-pink-700 ${isActive(link.href)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
} 