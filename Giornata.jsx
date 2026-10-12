import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Compass, Loader2, ArrowLeft, BookOpenText, Calendar, Clock, Earth, Headphones, Heart, HeartOff, Music2, Play, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchGiornata, enrichTrack } from "@/lib/api";
import { isFavorite, toggleFavorite, recordListen, subscribeStorage } from "@/lib/storage";
import { buildListenUrl } from "@/lib/listen";
import Tag from "@/components/Tag";
import { GIORNATA } from "@/constants/testIds";

const ITALIAN_MONTHS = ["", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
const RECURRENCE_LABEL = {
  nascita: "Nascita",
  morte: "Anniversario della morte",
  prima_esecuzione: "Prima esecuzione",
  pubblicazione: "Pubblicazione",
  evento_storico: "Evento storico",
  giornata_internazionale: "Giornata internazionale",
  scoperta_curata: "Scoperta curatoriale"
};

function italianMonthDay(dateKey) {
  if (!dateKey) return "";
  const [mm, dd] = dateKey.split("-").map(s => parseInt(s, 10));
  return `${dd} ${ITALIAN_MONTHS[mm]}`;
}

const MetaCell = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 bg-white p-4">
    <Icon className="mt-1 h-4 w-4 flex-shrink-0 text-[#D4A373]" strokeWidth={1.25} />
    <div className="min-w-0">
      <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#78716C]">{label}</p>
      <p className="mt-1 truncate font-serif text-base text-[#1C1917]">{value}</p>
    </div>
  </div>
);

const AscoltoSection = ({ track, index, label, testIds }) => {
  const [favorite, setFavorite] = useState(isFavorite(track.id));
  const [enriching, setEnriching] = useState(false);
  const [enrichedText, setEnrichedText] = useState("");

  useEffect(() => {
    return subscribeStorage(() => setFavorite(isFavorite(track.id)));
  }, [track.id]);

  const isClassical = track.category === "classical";
  const isScoperta = track.recurrence_type === "scoperta_curata";
  const recLabel = RECURRENCE_LABEL[track.recurrence_type] || track.recurrence_type;
  const listenUrl = buildListenUrl(track);

  const handleFavorite = () => {
    const next = toggleFavorite(track.id);
    setFavorite(next);
    toast(next ? "Aggiunto ai preferiti" : "Rimosso dai preferiti");
  };

  const handleListened = () => {
    recordListen(track);
    toast("Ascolto segnato nel tuo viaggio");
  };

  const handleApprofondisci = async () => {
    if (enriching) return;
    if (enrichedText) {
      setEnrichedText("");
      return;
    }
    setEnriching(true);
    try {
      const res = await enrichTrack(track.id);
      setEnrichedText(res.text);
    } catch {
      toast.error("Scheda non disponibile");
    } finally {
      setEnriching(false);
    }
  };

  const handleShare = async () => {
    const text = `Ho scoperto questo brano oggi su Almanacco Musicale: "${track.title}" — ${track.artist}`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: track.title, text, url });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast("Link copiato negli appunti");
    } catch {
      toast.error("Impossibile copiare il link");
    }
  };

  return (
    <section data-testid={testIds.root}>
      <div className="mb-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-[#EAE5D9]"></span>
        <span className="font-sans text-xs uppercase tracking-[0.32em] text-[#78716C]">{label}</span>
        <span className="h-px flex-1 bg-[#EAE5D9]"></span>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#EAE5D9] bg-black">
            <img src={track.image_url} alt={track.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1C1917]/40">
              {listenUrl ? (
                <a
                  href={listenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={testIds.play}
                  onClick={() => recordListen(track)}
                  className="group inline-flex items-center gap-3 border border-[#FDFBF7] bg-[#FDFBF7]/95 px-6 py-3 font-sans text-xs uppercase tracking-[0.32em] text-[#1C1917] transition hover:bg-[#FDFBF7]"
                >
                  <Play className="h-4 w-4 fill-[#7A1A2E] text-[#7A1A2E]" strokeWidth={1.25} />
                  Ascolta su YouTube
                </a>
              ) : (
                <span className="inline-flex cursor-not-allowed items-center gap-3 border border-[#FDFBF7]/60 bg-[#FDFBF7]/60 px-6 py-3 font-sans text-xs uppercase tracking-[0.32em] text-[#1C1917]/50">
                  Link non disponibile
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="inverse">{isClassical ? "Ascolto classico" : "Altri generi"}</Tag>
            <Tag tone={isClassical ? "default" : "secondary"}>{track.genre}</Tag>
            {track.era && <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#78716C]">{track.era}</span>}
            {track.year && <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#78716C]">· {track.year}</span>}
          </div>
          <h2 className="mt-5 font-serif text-3xl leading-tight tracking-tight text-[#1C1917] sm:text-4xl lg:text-5xl">{track.title}</h2>
          <p className="mt-3 font-serif text-xl italic text-[#7A1A2E] sm:text-2xl">{track.artist}</p>
          <div className="mt-8 border-l-4 border-[#7A1A2E] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#7A1A2E]">{isScoperta ? "Scelta del giorno" : "Ricorrenza musicale"}</p>
              <Tag tone="secondary">{recLabel}</Tag>
            </div>
            <p className="mt-3 font-serif text-lg leading-relaxed text-[#1C1917] sm:text-xl">{track.why_today}</p>
          </div>
          <p className="mt-6 text-base leading-relaxed text-[#1C1917]/80">{track.short_description}</p>
          <div className="mt-6 grid grid-cols-2 gap-px bg-[#EAE5D9] sm:grid-cols-4">
            <MetaCell icon={Calendar} label="Anno" value={track.year || "—"} />
            <MetaCell icon={Clock} label="Durata" value={track.duration || "—"} />
            <MetaCell icon={Earth} label="Paese" value={track.country || "—"} />
            <MetaCell icon={Music2} label="Epoca" value={track.era || "—"} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {listenUrl && (
              <a
                href={listenUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordListen(track)}
                className="inline-flex items-center justify-center bg-[#7A1A2E] px-4 py-2 text-sm font-medium text-[#FDFBF7] transition hover:bg-[#5A1121]"
              >
                <Play className="mr-2 h-4 w-4" strokeWidth={1.25} /> Ascolta su YouTube
              </a>
            )}
            <Button data-testid={testIds.approfondisci} onClick={handleApprofondisci} variant="outline" className="border-[#D4A373] text-[#1C1917]">
              <BookOpenText className="mr-2 h-4 w-4" strokeWidth={1.25} />
              {enrichedText ? "Chiudi approfondimento" : "Approfondisci"}
            </Button>
            <Button data-testid={testIds.favorite} onClick={handleFavorite} variant="outline" className={`border-[#7A1A2E] ${favorite ? "bg-[#7A1A2E] text-[#FDFBF7]" : "text-[#7A1A2E]"}`}>
              {favorite ? <HeartOff className="mr-2 h-4 w-4" /> : <Heart className="mr-2 h-4 w-4" />}
              {favorite ? "Rimuovi dai preferiti" : "Preferiti"}
            </Button>
            <Button data-testid={testIds.listened} onClick={handleListened} variant="outline" className="border-[#1C1917] text-[#1C1917]">
              <Headphones className="mr-2 h-4 w-4" /> Ho ascoltato questo brano
            </Button>
            <Button onClick={handleShare} variant="ghost" className="text-[#57534E]">
              <Share2 className="mr-2 h-4 w-4" /> Condividi
            </Button>
          </div>
          {enrichedText && (
            <article className="mt-8 border border-[#EAE5D9] bg-white p-6 sm:p-8">
              <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#7A1A2E]">Approfondimento culturale</p>
              <p className="mt-4 font-serif text-base leading-relaxed text-[#1C1917]/90">{enrichedText}</p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};

const Giornata = () => {
  const { dateKey } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchGiornata(dateKey);
        if (!cancelled) setData(res);
      } catch {
        if (!cancelled) toast.error("Giornata non trovata");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [dateKey]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-6 py-32">
        <Loader2 className="h-6 w-6 animate-spin text-[#7A1A2E]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="font-serif text-2xl text-[#1C1917]">Giornata non trovata.</p>
        <Button onClick={() => navigate("/archivio")} className="mt-6 bg-[#7A1A2E]">Torna all'archivio</Button>
      </div>
    );
  }

  const dateLabel = italianMonthDay(data.date_key);

  return (
    <div data-testid={GIORNATA.page} className="bg-[#FDFBF7]">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-12 lg:py-16">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-[#57534E] hover:text-[#1C1917]">
          <ArrowLeft className="h-4 w-4" /> Indietro
        </button>
        <header className="mt-8">
          <p data-testid={GIORNATA.date} className="font-sans text-xs uppercase tracking-[0.32em] text-[#7A1A2E]">
            Edizione del {dateLabel}
          </p>
          <h1 data-testid={GIORNATA.title} className="mt-5 font-serif text-4xl leading-none tracking-tighter text-[#1C1917] sm:text-5xl lg:text-6xl">
            {data.title}
          </h1>
          <p data-testid={GIORNATA.intro} className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-[#1C1917]/85 sm:text-xl">
            {data.intro}
          </p>
        </header>

        <AscoltoSection
          track={data.classical}
          index={1}
          label="Ascolto 1 — Musica classica"
          testIds={{
            root: GIORNATA.ascolto1,
            play: GIORNATA.ascolto1PlayBtn,
            approfondisci: GIORNATA.ascolto1ApprofondisciBtn,
            favorite: GIORNATA.ascolto1FavoriteBtn,
            listened: GIORNATA.ascolto1ListenedBtn
          }}
        />

        <div className="my-12 flex items-center gap-4 sm:my-16">
          <span className="h-px flex-1 bg-[#EAE5D9]"></span>
          <span className="font-sans text-xs uppercase tracking-[0.32em] text-[#78716C]">✦</span>
          <span className="h-px flex-1 bg-[#EAE5D9]"></span>
        </div>

        <AscoltoSection
          track={data.modern}
          index={2}
          label="Ascolto 2 — Altri generi"
          testIds={{
            root: GIORNATA.ascolto2,
            play: GIORNATA.ascolto2PlayBtn,
            approfondisci: GIORNATA.ascolto2ApprofondisciBtn,
            favorite: GIORNATA.ascolto2FavoriteBtn,
            listened: GIORNATA.ascolto2ListenedBtn
          }}
        />
      </div>
    </div>
  );
};

export default Giornata;