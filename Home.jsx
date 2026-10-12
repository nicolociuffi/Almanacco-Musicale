import React, { useState, useEffect } from "react";
import { Sparkles, Compass, Disc3 } from "lucide-react";
import { fetchDaily } from "@/lib/api";
import TrackCard from "@/components/TrackCard";
import Tag from "@/components/Tag";
import { HOME } from "@/constants/testIds";

const HERO_IMAGE = "https://images.unsplash.com/photo-1526394931762-90052e97b376?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwyfHx2aW55bCUyMHJlY29yZCUyMHBsYXllciUyMHZpbnRhZ2V8ZW58MHx8fHwxNzgyNTY1MzgzfDA&ixlib=rb-4.1.0&q=85";

const Home = () => {
  const [daily, setDaily] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchDaily();
        if (!cancelled) setDaily(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Errore");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isDiscovery = !!(daily?.is_discovery);

  return (
    <div data-testid={HOME.page} className="bg-[#FDFBF7]">
      <section data-testid={HOME.hero} className="relative overflow-hidden border-b border-[#EAE5D9]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-24">
          <div className="lg:col-span-7">
            <p className="font-sans text-xs uppercase tracking-[0.32em] text-[#7A1A2E]">
              {daily ? daily.italian_date || "Almanacco Musicale" : "almanacco musicale"}
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-none tracking-tighter text-[#1C1917] sm:text-5xl lg:text-7xl">
              Oggi <span className="italic text-[#7A1A2E]">in musica.</span>
            </h1>
            <p data-testid={HOME.tagline} className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-[#1C1917]/85 sm:text-2xl">
              Tutti i generi. Tutte le voci. Due ascolti al giorno per viaggiare nella storia della musica.
            </p>
            {daily && !isDiscovery && (
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Tag>{daily.title}</Tag>
                <span className="inline-flex items-center gap-2 text-sm text-[#57534E]">
                  <Sparkles className="h-4 w-4 text-[#D4A373]" strokeWidth={1.25} />
                  Edizione del giorno
                </span>
              </div>
            )}
          </div>
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#EAE5D9]">
              <img src={HERO_IMAGE} alt="Giradischi vintage" className="h-full w-full object-cover" />
              <div className="absolute bottom-6 left-6 right-6 border border-[#FDFBF7]/40 bg-[#1C1917]/70 p-5 text-[#FDFBF7] backdrop-blur-md">
                <p className="font-serif text-2xl italic leading-snug">«La musica è la matematica dei sensi.»</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[#D4A373]">— Marius Schneider</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {daily && isDiscovery && (
        <section data-testid={HOME.discoveryBanner} className="border-b border-[#EAE5D9] bg-[#FDFBF7]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:gap-6 lg:px-12">
            <Compass className="h-5 w-5 flex-shrink-0 text-[#7A1A2E]" strokeWidth={1.25} />
            <div className="flex-1">
              <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#7A1A2E]">Scelta del giorno</p>
              <p className="mt-1 font-serif text-base italic leading-relaxed text-[#1C1917]/90 sm:text-lg">
                Una selezione speciale curata da Almanacco Musicale.
              </p>
            </div>
          </div>
        </section>
      )}

      {daily && (
        <section className="border-b border-[#EAE5D9] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
            <p className="max-w-4xl font-serif text-lg leading-relaxed text-[#1C1917]/85 sm:text-xl">
              <span className="float-left mr-2 mt-1 font-serif text-6xl leading-none text-[#7A1A2E] sm:text-7xl">
                {daily.intro?.[0] || "O"}
              </span>
              {daily.intro?.slice(1)}
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        {loading && (
          <div className="flex items-center gap-3 text-[#57534E]">
            <Disc3 className="h-5 w-5 animate-spin" strokeWidth={1.25} />
            <span className="font-sans text-sm uppercase tracking-[0.22em]">In sintonia…</span>
          </div>
        )}
        {error && <p className="text-sm text-[#7A1A2E]">Impossibile caricare gli ascolti: {error}</p>}
        {daily && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <div data-testid={HOME.ascolto1Header} className="mb-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-[#EAE5D9]"></span>
                <span className="font-sans text-xs uppercase tracking-[0.32em] text-[#78716C]">Ascolto 1 — Musica classica</span>
                <span className="h-px flex-1 bg-[#EAE5D9]"></span>
              </div>
              <TrackCard track={daily.classical} testId={HOME.classicalCard} discoveryMode={isDiscovery} />
            </div>
            <div className="lg:col-span-5">
              <div data-testid={HOME.ascolto2Header} className="mb-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-[#EAE5D9]"></span>
                <span className="font-sans text-xs uppercase tracking-[0.32em] text-[#78716C]">Ascolto 2 — Altri generi</span>
                <span className="h-px flex-1 bg-[#EAE5D9]"></span>
              </div>
              <TrackCard track={daily.modern} testId={HOME.modernCard} discoveryMode={isDiscovery} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;