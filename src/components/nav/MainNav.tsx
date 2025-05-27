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
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector('nav');
      if (isMobileMenuOpen && nav && !nav.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 770);
    };
    
    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => {
    return pathname === path ? "border-b-2 border-theme-accent-primary" : "";
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
        <span className="text-theme-primary hover:text-theme-hover-text w-full text-left">
          Login
        </span>
      } /> : undefined
    },
    ...(user ? [
      {
        href: "#",
        label: "Sign Out",
        onClick: () => {
          signOut();
          // Refresh the page to clear user-specific data
          setTimeout(() => {
            window.location.reload();
          }, 500); // Small delay to allow sign out to complete
        },
        "aria-label": "Sign out of your account"
      }
    ] : [])
  ];

  return (
    <header className="w-full border-b bg-theme-section-primary border-theme-border-default" >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center" aria-label="Main navigation">
        <Link 
          href="/" 
          className="text-2xl text-theme-primary font-light"
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
                  className={`text-theme-primary hover:text-theme-hover-text  ${isActive(link.href)}`}
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
                  <Sun className="h-5 w-5 text-theme-primary" />
                ) : (
                  <Moon className="h-5 w-5 text-theme-primary" />
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
                  <Sun className="h-5 w-5 text-theme-primary" />
                ) : (
                  <Moon className="h-5 w-5 text-theme-primary" />
                )
              )}
            </button>
            
            <button 
              className="text-theme-primary"
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
              bg-theme-accent-secondary border-b shadow-lg
              transition-transform duration-300 ease-in-out"
            role="navigation"
            aria-label="Mobile menu"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                link.component ? (
                  <div key={link.href} onClick={(e) => {
                    e.preventDefault();
                    if (!link.component) {
                      setIsMobileMenuOpen(false);
                    }
                  }}>
                    {link.component}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-theme-primary hover:text-theme-hover-text ${isActive(link.href)}`}
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