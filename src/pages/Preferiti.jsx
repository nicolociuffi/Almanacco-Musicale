import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTracksBulk } from "@/lib/api";
import { getFavorites, subscribeStorage } from "@/lib/storage";
import TrackCard from "@/components/TrackCard";
import { PREFERITI } from "@/constants/testIds";

const Preferiti = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const ids = getFavorites();
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      const data = await fetchTracksBulk(ids);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    return subscribeStorage(refresh);
  }, []);

  return (
    <div data-testid={PREFERITI.page} className="bg-[#FDFBF7]">
      <section className="border-b border-[#EAE5D9]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
          <p className="font-sans text-xs uppercase tracking-[0.32em] text-[#7A1A2E]">Preferiti</p>
          <h1 className="mt-5 font-serif text-4xl leading-none tracking-tighter text-[#1C1917] sm:text-5xl lg:text-6xl">
            I brani che hai <br /><span className="italic text-[#7A1A2E]">scelto.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-[#1C1917]/85 sm:text-xl">
            Una piccola antologia personale. Aggiungi brani al cuore mentre sfogli l'almanacco: ritroverai qui ogni voce.
          </p>
        </div>
      </section>

      <section data-testid={PREFERITI.list} className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        {loading && <p className="font-sans text-sm uppercase tracking-[0.22em] text-[#78716C]">Caricamento preferiti…</p>}
        {!loading && items.length === 0 && (
          <div data-testid={PREFERITI.empty} className="border border-dashed border-[#EAE5D9] p-12 text-center">
            <Heart className="mx-auto h-8 w-8 text-[#D4A373]" strokeWidth={1.25} />
            <p className="mt-4 font-serif text-2xl text-[#1C1917]">Ancora nessun preferito.</p>
            <p className="mt-2 text-sm text-[#57534E]">Apri uno dei brani del giorno e tocca «Salva nei preferiti».</p>
            <Button asChild className="mt-6 bg-[#7A1A2E]">
              <Link to="/">Scopri gli ascolti di oggi</Link>
            </Button>
          </div>
        )}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ track }) => (
              <TrackCard key={track.id} track={track} testId={`preferiti-card-${track.id}`} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Preferiti;