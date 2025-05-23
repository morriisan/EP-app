"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";

interface SidebarLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ links, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    return pathname === path;
  };

  const SidebarContent = () => (
    <>
      {/* User Profile Section */}
      <div className="p-6 border-b">
        <div className="flex flex-col">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {userName || "User"}
          </h2>
          <h3 className="text-sm text-gray-600 dark:text-gray-400">
            {userEmail || "email@example.com"}
          </h3>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors
                  ${isActive(link.href)
                    ? "bg-pink-50 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-800 dark:text-gray-300 dark:hover:bg-pink-900 dark:hover:text-pink-100"
                  }`}
                onClick={() => isMobile && setShowSidebar(false)}
              >
                {link.icon && <span className="w-5 h-5">{link.icon}</span>}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );

  if (!isMobile) {
    return (
      <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r">
        <SidebarContent />
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.div 
        className="fixed -left-10 hover:left-0 top-20 z-40 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800
            border-y border-r border-gray-100 dark:border-gray-700
            hover:border-pink-200 dark:hover:border-pink-800
            hover:bg-pink-50 dark:hover:bg-pink-900/10
            rounded-r-lg
            transition-all duration-300"
        >
          <div className="flex flex-col gap-1 items-start">
            <Menu className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium  bg-pink-800 
            dark:from-gray-200 dark:to-pink-200 bg-clip-text text-transparent">
            Menu
          </span>
        </button>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowSidebar(false)}
              role="presentation"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-xl z-50 w-64"
              role="navigation"
              aria-label="Mobile sidebar"
            >
              {/* Close Handle */}
              <div className="flex justify-end p-4">
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowSidebar(false)}
                  aria-label="Close sidebar"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 