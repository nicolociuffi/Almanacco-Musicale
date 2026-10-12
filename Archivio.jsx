import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { fetchArchive } from "@/lib/api";
import { Input } from "@/components/ui/input";
import Tag from "@/components/Tag";
import { ARCHIVIO } from "@/constants/testIds";

const ITALIAN_MONTHS = ["", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
const ARCHIVE_BANNER = "https://images.pexels.com/photos/33463773/pexels-photo-33463773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

function formatItalianDateKey(dateKey) {
  const [mm, dd] = dateKey.split("-").map(s => parseInt(s, 10));
  return `${dd} ${ITALIAN_MONTHS[mm]}`;
}

const Archivio = () => {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchArchive();
        setEntries(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(e =>
      [e.title, e.intro, e.classical?.title, e.classical?.artist, e.classical?.genre, e.modern?.title, e.modern?.artist, e.modern?.genre]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [entries, query]);

  return (
    <div data-testid={ARCHIVIO.page} className="bg-[#FDFBF7]">
      <section className="relative overflow-hidden border-b border-[#EAE5D9]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-12 lg:px-12 lg:py-20">
          <div className="lg:col-span-7">
            <p className="font-sans text-xs uppercase tracking-[0.32em] text-[#7A1A2E]">Calendario musicale</p>
            <h1 className="mt-5 font-serif text-4xl leading-none tracking-tighter text-[#1C1917] sm:text-5xl lg:text-6xl">
              Il calendario musicale.
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-[#1C1917]/85 sm:text-xl">
              Sfoglia ogni giornata dell'almanacco — passata, presente o futura. Due ascolti per ogni data, con il loro contesto e la ricorrenza che li ha ispirati.
            </p>
            <div className="mt-8 max-w-lg">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]" strokeWidth={1.25} />
                <Input
                  data-testid={ARCHIVIO.searchInput}
                  placeholder="Cerca per autore, genere o titolo…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="rounded-none border-[#EAE5D9] bg-white pl-10"
                />
              </div>
            </div>
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <div className="aspect-[4/5] overflow-hidden border border-[#EAE5D9]">
              <img src={ARCHIVE_BANNER} alt="Dischi in vinile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section data-testid={ARCHIVIO.list} className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        {loading && <p className="font-sans text-sm uppercase tracking-[0.22em] text-[#78716C]">Caricamento archivio…</p>}
        {!loading && filtered.length === 0 && (
          <p className="font-serif text-xl text-[#57534E]">Nessun risultato. Prova un'altra parola chiave.</p>
        )}
        <div className="grid grid-cols-1 gap-px bg-[#EAE5D9] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(entry => (
            <Link
              key={entry.date_key}
              to={`/giornata/${entry.date_key}`}
              data-testid={`${ARCHIVIO.dayCardPrefix}${entry.date_key}`}
              className="group flex flex-col gap-4 bg-white p-7 transition duration-300 hover:bg-[#FDFBF7]"
            >
              <div className="flex items-center justify-between">
                <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#7A1A2E]">
                  {formatItalianDateKey(entry.date_key)}
                </p>
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#78716C]">Edizione</span>
              </div>
              <h3 className="font-serif text-2xl leading-snug tracking-tight text-[#1C1917]">{entry.title}</h3>
              <p className="text-sm leading-relaxed text-[#57534E] line-clamp-3">{entry.intro}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {entry.classical?.genre && <Tag>{entry.classical.genre}</Tag>}
                {entry.modern?.genre && <Tag tone="secondary">{entry.modern.genre}</Tag>}
              </div>
              <div className="mt-auto pt-4 border-t border-[#EAE5D9]">
                <p className="font-serif text-sm italic text-[#7A1A2E]">
                  <span>{entry.classical?.artist}</span> · <span>{entry.modern?.artist}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Archivio;