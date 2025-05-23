import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-start py-8">
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl text-pink-800 font-light">Engel Paradis AS</h3>
          <p className="text-sm text-pink-800">Elegant bryllupsplanlegging og arrangementer</p>
          <div className="text-sm text-black">
            <p>Telefon: +47 900 52 670</p>
            <p>Adresse: Haavard martinsens vei 19</p>
            <p>0978 Oslo, Norge</p>
          </div>
        </div>
        
        <nav className="flex space-x-8">
          <Link href="/" className="text-pink-900 hover:text-pink-700">
            Hjem
          </Link>
          <Link href="/gallery" className="text-pink-900 hover:text-pink-700">
            Galleri
          </Link>
          <Link href="/booking" className="text-pink-900 hover:text-pink-700">
            Bokdato
          </Link>
          <Link href="/myPage" className="text-pink-900 hover:text-pink-700">
            Min side
          </Link>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-pink-100 pb-8">
        <p className="text-center text-sm text-pink-700">&copy; 2025 Engel Paradis. Alle rettigheter forbeholdt.</p>
      </div>
    </footer>
  );
} 