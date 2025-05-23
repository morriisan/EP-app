"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { AuthPanel } from "@/components/AuthPanel";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      component: !user ? <AuthPanel trigger={
        <span className="text-pink-900 hover:text-pink-700 dark:text-pink-300 dark:hover:text-pink-400 w-full text-left">
          Login
        </span>
      } /> : undefined
    },
    ...(user ? [
      {
        href: "#",
        label: "Sign Out",
        onClick: () => signOut(),
        "aria-label": "Sign out of your account"
      }
    ] : [])
  ];

  return (
    <header className="w-full border-b bg-gradient-to-r from-pink-100 to-pink-200 border-pink-200 dark:border-0 dark:bg-gradient-to-r dark:from-pink-400  dark:to-rose-950 transition-colors duration-200">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center" aria-label="Main navigation">
        <Link 
          href="/" 
          className="text-2xl text-pink-800 dark:text-pink-200 font-light"
          aria-label="Engel Paradis home"
        >
          Engel Paradis
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center space-x-6" role="navigation" aria-label="Desktop menu">
            {navLinks.map((link) => (
              link.component ? (
                <div key={link.href} onClick={(e) => e.preventDefault()}>
                  {link.component}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-pink-900 hover:text-pink-700 dark:text-pink-300 dark:hover:text-pink-400 ${isActive(link.href)}`}
                  onClick={link.onClick}
                >
                  {link.label}
                </Link>
              )
            ))}
            
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle Dark Mode"
            >
              {mounted && (
                theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-pink-300" />
                ) : (
                  <Moon className="h-5 w-5 text-pink-800" />
                )
              )}
            </button>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle Dark Mode"
            >
              {mounted && (
                theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-pink-300" />
                ) : (
                  <Moon className="h-5 w-5 text-pink-800" />
                )
              )}
            </button>
            
            <button 
              className="text-pink-900 dark:text-pink-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="absolute top-16 left-0 right-0 w-full z-50
              bg-white  dark:bg-slate-900 border-b shadow-lg
              transition-transform duration-300 ease-in-out"
            role="navigation"
            aria-label="Mobile menu"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                link.component ? (
                  <div key={link.href} className="cursor-pointer">
                    {link.component}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-pink-900 hover:text-pink-700 dark:text-pink-300 dark:hover:text-pink-400 ${isActive(link.href)}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (link.onClick) link.onClick();
                    }}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 