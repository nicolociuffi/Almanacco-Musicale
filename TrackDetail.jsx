import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpenText, Calendar, Clock, Earth, Headphones, Heart, HeartOff, Music2, Play, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchTrack, enrichTrack } from "@/lib/api";
import { isFavorite, toggleFavorite, recordListen, subscribeStorage } from "@/lib/storage";
import { buildListenUrl } from "@/lib/listen";
import Tag from "@/components/Tag";
import { TRACK } from "@/constants/testIds";

const RECURRENCE_LABEL = {
  nascita: "Nascita",
  morte: "Anniversario della morte",
  prima_esecuzione: "Prima esecuzione",
  pubblicazione: "Pubblicazione",
  evento_storico: "Evento storico",
  giornata_internazionale: "Giornata internazionale",
  scoperta_curata: "Scoperta curatoriale"
};

const MetaCell = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 bg-white p-5">
    <Icon className="mt-1 h-4 w-4 flex-shrink-0 text-[#D4A373]" strokeWidth={1.25} />
    <div className="min-w-0">
      <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#78716C]">{label}</p>
      <p className="mt-1 truncate font-serif text-lg text-[#1C1917]">{value}</p>
    </div>
  </div>
);

const TrackDetail = () => {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [enrichedText, setEnrichedText] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchTrack(trackId);
        if (!cancelled) {
          setData(res);
          setFavorite(isFavorite(trackId));
        }
      } catch {
        if (!cancelled) toast.error("Impossibile caricare il brano");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [trackId]);

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
        <p className="font-serif text-2xl text-[#1C1917]">Brano non trovato.</p>
        <Button onClick={() => navigate("/")} className="mt-6 bg-[#7A1A2E]">Torna alla home</Button>
      </div>
    );
  }

  const { track, day_context } = data;
  const isClassical = track.category === "classical";
  const listenUrl = buildListenUrl(track);

  return (
    <div data-testid={TRACK.page} className="bg-[#FDFBF7]">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-12 lg:py-16">
        <button type="button" onClick={() => navigate(-1)} data-testid={TRACK.backLink} className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-[#57534E] hover:text-[#1C1917]">
          <ArrowLeft className="h-4 w-4" /> Indietro
        </button>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Tag tone="inverse">{isClassical ? "Ascolto classico" : "Altri generi"}</Tag>
          <Tag tone={isClassical ? "default" : "secondary"}>{track.genre}</Tag>
          {track.era && <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#78716C]">{track.era}</span>}
          {track.year && <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#78716C]">· {track.year}</span>}
        </div>

        <h1 data-testid={TRACK.title} className="mt-6 font-serif text-4xl leading-none tracking-tighter text-[#1C1917] sm:text-5xl lg:text-6xl">{track.title}</h1>
        <p data-testid={TRACK.artist} className="mt-4 font-serif text-2xl italic text-[#7A1A2E]">{track.artist}</p>

        <div className="mt-10">
          <div className="relative aspect-video w-full overflow-hidden border border-[#EAE5D9] bg-black">
            <img src={track.image_url} alt={track.title} className="h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1C1917]/55">
              {listenUrl ? (
                <a
                  href={listenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={TRACK.listenBtn}
                  onClick={() => recordListen(track)}
                  className="inline-flex items-center gap-3 border border-[#FDFBF7] bg-[#FDFBF7]/95 px-6 py-3 font-sans text-xs uppercase tracking-[0.32em] text-[#1C1917] transition hover:bg-[#FDFBF7]"
                >
                  <Play className="h-4 w-4 fill-[#7A1A2E] text-[#7A1A2E]" strokeWidth={1.25} />
                  Ascolta su YouTube
                </a>
              ) : (
                <span className="inline-flex cursor-not-allowed items-center gap-3 border border-[#FDFBF7]/60 bg-[#FDFBF7]/60 px-6 py-3 text-[#1C1917]/50">
                  Link non disponibile
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button data-testid={TRACK.markListenedBtn} onClick={() => { recordListen(track); toast("Ascolto registrato"); }} className="bg-[#1C1917] text-[#FDFBF7]">
            <Headphones className="mr-2 h-4 w-4" /> Ho ascoltato
          </Button>
          <Button data-testid={TRACK.saveFavoriteBtn} onClick={() => { const next = toggleFavorite(track.id); setFavorite(next); toast(next ? "Salvato nei preferiti" : "Rimosso"); }} variant="outline" className={`border-[#7A1A2E] ${favorite ? "bg-[#7A1A2E] text-[#FDFBF7]" : "text-[#7A1A2E]"}`}>
            {favorite ? <HeartOff className="mr-2 h-4 w-4" /> : <Heart className="mr-2 h-4 w-4" />}
            {favorite ? "Rimuovi dai preferiti" : "Salva nei preferiti"}
          </Button>
        </div>

        <section data-testid={TRACK.whyToday} className="mt-12 border-l-4 border-[#7A1A2E] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#7A1A2E]">Perché oggi?</p>
            <Tag tone="secondary">{RECURRENCE_LABEL[track.recurrence_type] || track.recurrence_type}</Tag>
          </div>
          <p className="mt-4 font-serif text-xl leading-relaxed text-[#1C1917] sm:text-2xl">{track.why_today}</p>
        </section>

        <section data-testid={TRACK.metadata} className="mt-10 grid grid-cols-2 gap-px bg-[#EAE5D9] sm:grid-cols-4">
          <MetaCell icon={Calendar} label="Anno" value={track.year || "—"} />
          <MetaCell icon={Clock} label="Durata" value={track.duration || "—"} />
          <MetaCell icon={Earth} label="Paese" value={track.country || "—"} />
          <MetaCell icon={Music2} label="Epoca" value={track.era || "—"} />
        </section>

        <article className="mt-12 max-w-3xl">
          <p className="font-serif text-lg leading-relaxed text-[#1C1917]/90 sm:text-xl">{track.short_description}</p>
        </article>

        {day_context && (
          <section className="mt-16 border-t border-[#EAE5D9] pt-10">
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#78716C]">Edizione del giorno</p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight text-[#1C1917] sm:text-3xl">{day_context.title}</h2>
            <p className="mt-3 max-w-3xl font-serif text-base leading-relaxed text-[#57534E] sm:text-lg">{day_context.intro}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default TrackDetail;