export default function Home() {
  return (
    <>
      <main className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-20">
          <span className="text-theme-accent-primary italic text-2xl mb-2 font-light">Velkommen til</span>
          <h1 className="text-5xl md:text-7xl text-center font-extralight tracking-[0.2em] text-theme-primary mb-4">
            Engel Paradis
          </h1>
          <p className="text-lg text-theme-primary text-center mb-16 font-light">
            Elegant bryllupsplanlegging og arrangementer for alle
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
            <a 
              href="/gallery" 
              className="px-12 py-4 bg-theme-section-primary hover:bg-theme-hover-primary text-theme-primary rounded-2xl border-2 border-theme-border-default 
                       shadow-md transition duration-300 text-lg hover:scale-105 text-center"
            >
              Gallery
            </a>
            <a 
              href="/booking" 
              className="px-12 py-4 bg-theme-section-primary hover:bg-theme-hover-secondary text-theme-secondary rounded-2xl border-2 border-theme-border-secondary
                       shadow-md transition duration-300 text-lg hover:scale-105 text-center"
            >
              Book Date
            </a>
          </div>
        </section>

        <div className="divider"></div>
        
        {/* Features Section */}
        <section className="mt-20 py-12 bg-theme-section-primary rounded-lg shadow-xl">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl text-center font-light text-theme-primary mb-8">
              Å skape <span className="text-theme-accent-primary border-b border-theme-accent-primary">tidløse</span> bryllupsopplevelser
            </h2>
            <p className="text-lg text-center text-theme-primary mb-8">
              Hos Engel Paradis spesialiserer vi oss på å skape elegante, kulturelt autentiske sør-asiatiske og muslimske
              bryllupsferinger som hedrer tradisjonene deres samtidig som de skaper uforglemmelige øyeblikk.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Personal Planning Feature */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl text-pink-800 mb-2">Personlig planlegging</h3>
                <p className="text-center text-pink-700">
                  Skreddersydd bryllupsdesign som gjenspeiler deres unike kjærlighetshistorie
                </p>
              </div>

              {/* Venue Feature */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 22V12h6v10" />
                  </svg>
                </div>
                <h3 className="text-xl text-purple-800 mb-2">Utsøkt sted</h3>
                <p className="text-center text-purple-700">
                  Et fantastisk, tilpassbart rom for din spesielle dag
                </p>
              </div>

              {/* Cultural Expertise Feature */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 ">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl text-rose-800 mb-2">Kulturell ekspertise</h3>
                <p className="text-center text-rose-700">
                  Spesialisert på sør-asiatiske og muslimske bryllupstradisjoner
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      
    </>
  );
}