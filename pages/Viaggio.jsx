import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { History, Trash2 } from "lucide-react";
import { getHistory, getFavorites, clearAllJourney, subscribeStorage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VIAGGIO } from "@/constants/testIds";

const GENDER_LABEL = {
  M: "voci maschili",
  F: "voci femminili",
  mixed: "voci miste",
  unknown: "non identificate"
};

const StatBlock = ({ label, value, accent = false, testId }) => (
  <div data-testid={testId} className="flex flex-col gap-3 bg-white p-6 sm:p-8">
    <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#78716C]">{label}</p>
    <p className={`font-serif text-4xl tracking-tight sm:text-5xl ${accent ? "text-[#7A1A2E]" : "text-[#1C1917]"}`}>
      {value}
    </p>
  </div>
);

const Viaggio = () => {
  const [history, setHistory] = useState([]);
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    const refresh = () => {
      setHistory(getHistory());
      setFavs(getFavorites());
    };
    refresh();
    return subscribeStorage(refresh);
  }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const classical = history.filter(h => h.category === "classical").length;
    const modern = history.filter(h => h.category === "modern").length;
    const genres = {};
    const countries = {};
    const eras = {};
    const voices = { M: 0, F: 0, mixed: 0, unknown: 0 };

    history.forEach(h => {
      const g = h.genre || "Altro";
      genres[g] = (genres[g] || 0) + 1;
      if (h.country) countries[h.country] = (countries[h.country] || 0) + 1;
      if (h.era) eras[h.era] = (eras[h.era] || 0) + 1;
      const k = h.artist_gender || "unknown";
      voices[k] = (voices[k] || 0) + 1;
    });

    return {
      total,
      classical,
      modern,
      genresCount: Object.keys(genres).length,
      countriesCount: Object.keys(countries).length,
      erasCount: Object.keys(eras).length,
      voices
    };
  }, [history]);

  const handleReset = () => {
    if (!window.confirm("Confermi di voler azzerare il tuo viaggio musicale?")) return;
    clearAllJourney();
    toast("Il tuo viaggio è stato azzerato");
  };

  return (
    <div data-testid={VIAGGIO.page} className="bg-[#FDFBF7]">
      <section className="relative overflow-hidden border-b border-[#EAE5D9]">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <p className="font-sans text-xs uppercase tracking-[0.32em] text-[#7A1A2E]">Il mio viaggio</p>
          <h1 className="mt-5 font-serif text-4xl leading-none tracking-tighter text-[#1C1917] sm:text-5xl lg:text-6xl">
            Un viaggio culturale,<br />non una <span className="italic text-[#7A1A2E]">classifica.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-[#1C1917]/85 sm:text-xl">
            Una mappa essenziale di ciò che hai ascoltato: generi, paesi, epoche e voci.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-2 gap-px bg-[#EAE5D9] lg:grid-cols-4">
          <StatBlock testId={VIAGGIO.totalListens} label="Ascolti completati" value={stats.total} accent />
          <StatBlock testId={VIAGGIO.classicalListens} label="Brani classici" value={stats.classical} />
          <StatBlock testId={VIAGGIO.modernListens} label="Altri generi" value={stats.modern} />
          <StatBlock testId={VIAGGIO.favoritesCount} label="Preferiti" value={favs.length} accent />
        </div>
      </section>

      <section data-testid={VIAGGIO.recentList} className="mx-auto max-w-7xl px-6 pb-20 lg:px-12">
        <div className="flex items-end justify-between border-b border-[#EAE5D9] pb-4">
          <h2 className="font-serif text-2xl tracking-tight text-[#1C1917] sm:text-3xl">Ascolti recenti</h2>
          {history.length > 0 && (
            <Button data-testid={VIAGGIO.resetBtn} variant="ghost" onClick={handleReset} className="text-xs uppercase tracking-[0.22em] text-[#78716C]">
              <Trash2 className="mr-2 h-4 w-4" /> Azzera
            </Button>
          )}
        </div>
        {history.length === 0 ? (
          <div className="mt-10 border border-dashed border-[#EAE5D9] p-12 text-center">
            <History className="mx-auto h-8 w-8 text-[#D4A373]" strokeWidth={1.25} />
            <p className="mt-4 font-serif text-2xl text-[#1C1917]">Il tuo viaggio inizia oggi.</p>
            <p className="mt-2 text-sm text-[#57534E]">Apri uno dei brani del giorno e tocca «Ho ascoltato».</p>
            <Button asChild className="mt-6 bg-[#7A1A2E]">
              <Link to="/">Vai agli ascolti di oggi</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-[#EAE5D9] border-t border-[#EAE5D9]">
            {history.slice(0, 30).map(item => (
              <li key={item.trackId + item.listenedAt} className="py-5">
                <Link to={`/brano/${item.trackId}`} className="group flex items-center justify-between gap-4">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#7A1A2E]">{item.genre} · {item.category === "classical" ? "Classico" : "Altri generi"}</p>
                    <p className="mt-1 font-serif text-xl text-[#1C1917]">{item.title}</p>
                    <p className="font-serif italic text-[#7A1A2E]">{item.artist}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Viaggio;