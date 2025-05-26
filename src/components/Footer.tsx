'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // Using 640px as breakpoint (sm)
    };
    
    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <footer className="mt-20 bg-theme-section-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`flex ${isMobile ? 'flex-col space-y-6' : 'justify-between items-start'}`}>
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl text-theme-primary font-light">Engel Paradis AS</h3>
            <p className="text-sm text-theme-primary">Elegant bryllupsplanlegging og arrangementer</p>
            <div className="text-sm text-theme-accent-primary">
              <p>Telefon: +47 900 52 670</p>
              <p>Adresse: Haavard martinsens vei 19</p>
              <p>0978 Oslo, Norge</p>
            </div>
          </div>
          
          <nav className={`flex ${isMobile ? 'flex-col space-y-4' : 'space-x-8'}`}>
            <Link href="/" className="text-theme-primary hover:text-theme-accent-primary">
              Hjem
            </Link>
            <Link href="/gallery" className="text-theme-primary hover:text-theme-accent-primary">
              Gallery
            </Link>
            <Link href="/booking" className="text-theme-primary hover:text-theme-accent-primary">
              Book Date
            </Link>
            <Link href="/myPage" className="text-theme-primary hover:text-theme-accent-primary">
              My Page
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-theme-border-default pb-8">
        <p className="text-center text-sm text-theme-primary">&copy; 2025 Engel Paradis. Alle rettigheter forbeholdt.</p>
      </div>
    </footer>
  );
} 