import Image from "next/image";
import Link from "next/link";

const featuredMedia = [
  {
    id: "manual-1",
    url: "https://wfiadop71w.ufs.sh/f/W4XJeOQccmxRs3nvJ9U0Gnk2T8BrhaV5iHmA4pcelbx6PyK9",
    title: "Featured moment 1",
  },
  {
    id: "manual-2",
    url: "https://wfiadop71w.ufs.sh/f/W4XJeOQccmxRUl1ReHdUAI634sblYp7Vc8Wh2NPZGOjwLzeD",
    title: "Featured moment 2",
  },
  {
    id: "manual-3",
    url: "https://wfiadop71w.ufs.sh/f/W4XJeOQccmxRWmuwBaccmxRj0AvdJN76seMVo5wp32XfybBL",
    title: "Featured moment 3",
  },
].filter((item) => item.url.trim().length > 0);

export default function Home() {

  return (
    <>
      <div className="relative isolate overflow-x-clip">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.18), transparent 45%), radial-gradient(circle at 80% 10%, rgba(139, 92, 246, 0.15), transparent 45%)",
          }}
        />
        <main className="container mx-auto px-6 relative z-10">

        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center py-20">
          <span className="text-theme-accent-primary italic text-2xl mb-2 font-light">Velkommen til</span>
          <h1 className="text-5xl md:text-7xl text-center font-extralight tracking-[0.2em] text-theme-primary mb-4">
            Engel Paradis
          </h1>
          <p className="text-lg text-theme-primary text-center mb-16 font-light">
            Elegant bryllupsplanlegging og arrangementer i Oslo
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
            <Link
              href="/gallery"
              className="px-12 py-4 bg-theme-section-primary hover:bg-theme-hover-primary text-theme-primary rounded-2xl border-2 border-theme-border-default 
                       shadow-md transition duration-300 text-lg hover:scale-105 text-center
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2"
            >
              Gallery
            </Link>
            <Link
              href="/booking"
              className="px-12 py-4 bg-theme-section-primary hover:bg-theme-hover-secondary text-theme-secondary rounded-2xl border-2 border-theme-border-secondary
                       shadow-md transition duration-300 text-lg hover:scale-105 text-center
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2"
            >
              Book Date
            </Link>
          </div>
        </section>

        <div className="divider"></div>

        <section className="mt-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-light text-theme-primary">Featured Moments</h2>
              <p className="text-theme-accent-primary font-light mt-1">
                Et lite glimt av kjærlighet
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-sm md:text-base text-theme-primary border-b border-theme-border-default hover:border-theme-accent-primary transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2"
            >
              Se hele galleriet
            </Link>
          </div>

          {featuredMedia.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {featuredMedia.map((item) => (
                <Link
                  key={item.id}
                  href="/gallery"
                  className="group relative block overflow-hidden rounded-2xl border border-theme-border-default bg-theme-section-primary shadow-md
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={item.url}
                      alt={item.title || "Gallery image"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 "
                    />
                   
                  </div>
                </Link>
                
              ))}
              
            </div>
            
          ) : (
            <div className="rounded-2xl border border-theme-border-default bg-theme-section-primary p-8 text-center text-theme-primary">
              Ingen bilder enda - legg til media i galleriet for aa vise highlights her.
            </div>
          )}
        </section>
        
        {/* Features Section */}
        <section className="mt-20 py-12 bg-theme-section-primary rounded-lg shadow-xl">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl text-center font-light text-theme-primary mb-8">
              Å skape <span className="text-theme-accent-primary border-b border-theme-accent-primary">tidløse</span> bryllupsopplevelser
            </h2>
            <p className="text-lg text-center text-theme-primary mb-8">
              Hos Engel Paradis spesialiserer vi oss på å skape elegante, kulturelt autentiske
              bryllupsferinger som hedrer tradisjonen samtidig som det skaper uforglemmelige minner.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Personal Planning Feature */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-theme-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl text-theme-primary mb-2">Personlig planlegging</h3>
                <p className="text-center text-theme-primary">
                  Skreddersydd bryllupsdesign som gjenspeiler deres unike kjærlighetshistorie
                </p>
              </div>

              {/* Venue Feature */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-theme-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 22V12h6v10" />
                  </svg>
                </div>
                <h3 className="text-xl text-theme-primary mb-2">Utsøkt sted</h3>
                <p className="text-center text-theme-primary">
                  Et fantastisk, tilpassbart rom for din spesielle dag
                </p>
              </div>

              {/* Cultural Expertise Feature */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 ">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-theme-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl text-theme-primary mb-2">Kulturell ekspertise</h3>
                <p className="text-center text-theme-primary">
                  Spesialisert på kulturelle bryllupstradisjoner
                </p>
              </div>
            </div>
          </div>
        </section>
        </main>
      </div>

      
    </>
  );
}