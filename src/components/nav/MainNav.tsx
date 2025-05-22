"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { AuthPanel } from "@/components/AuthPanel";
import { useTheme } from "next-themes";

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
      component: !user ? <AuthPanel trigger={<span className="text-pink-900 hover:text-pink-700 dark:text-pink-300 dark:hover:text-pink-400">Login</span>} /> : undefined
    },
    ...(user ? [
      {
        href: "#",
        label: "Sign Out",
        onClick: () => signOut()
      }
    ] : [])
  ];

  return (
    <header className="w-full border-b bg-gradient-to-r from-pink-100 to-pink-200 border-pink-200 dark:border-0 dark:bg-gradient-to-r dark:from-pink-400  dark:to-rose-950 transition-colors duration-200">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl text-pink-800 dark:text-pink-200 font-light"
        >
          Engel Paradis
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center space-x-6">
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
                  // Sun icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  // Moon icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )
              )}
            </button>
            
            <button 
              className="text-pink-900 dark:text-pink-300"
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
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="absolute top-16 left-0 right-0 w-full z-50
              bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:via-pink-950 dark:to-purple-950 border-b shadow-lg
              transition-transform duration-300 ease-in-out"
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