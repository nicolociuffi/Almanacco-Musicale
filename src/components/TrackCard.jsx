import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Headphones } from "lucide-react";
import Tag from "@/components/Tag";

const CATEGORY_LABEL = {
  classical: "Ascolto classico",
  modern: "Altri generi"
};

const RECURRENCE_LABEL = {
  nascita: "Nascita",
  morte: "Anniversario",
  prima_esecuzione: "Prima esecuzione",
  pubblicazione: "Pubblicazione",
  evento_storico: "Evento storico",
  giornata_internazionale: "Giornata internazionale",
  scoperta_curata: "Scoperta curatoriale"
};

const ITALIAN_MONTHS = ["", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

function dateKeyFromTrackId(trackId) {
  const parts = trackId.split("-");
  if (parts.length < 3) return null;
  return `${parts[0]}-${parts[1]}`;
}

function italianMonthDay(dateKey) {
  if (!dateKey) return "";
  const [mm, dd] = dateKey.split("-").map(s => parseInt(s, 10));
  return `${dd} ${ITALIAN_MONTHS[mm]}`;
}

const TrackCard = ({ track, variant = "feature", testId, discoveryMode = false }) => {
  const isClassical = track.category === "classical";
  const image = track.image_url;
  const dateKey = dateKeyFromTrackId(track.id);

  if (variant === "compact") {
    return (
      <Link to={`/brano/${track.id}`} data-testid={testId} className="group flex items-stretch gap-4 border border-[#EAE5D9] bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#7A1A2E]">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden border border-[#EAE5D9]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex items-center gap-2">
            <Tag tone={isClassical ? "default" : "secondary"}>{track.genre}</Tag>
            {track.year && <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#78716C]">{track.year}</span>}
          </div>
          <h4 className="truncate font-serif text-lg text-[#1C1917]">{track.title}</h4>
          <p className="truncate text-sm text-[#57534E]">{track.artist}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 flex-shrink-0 self-start text-[#7A1A2E] opacity-0 transition group-hover:opacity-100" strokeWidth={1.25} />
      </Link>
    );
  }

  return (
    <Link to={`/brano/${track.id}`} data-testid={testId} className="group flex flex-col border border-[#EAE5D9] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-25px_rgba(28,25,23,0.35)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute left-4 top-4">
          <Tag tone="inverse">{CATEGORY_LABEL[track.category]}</Tag>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone={isClassical ? "default" : "secondary"}>{track.genre}</Tag>
          {track.era && <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#78716C]">{track.era}</span>}
          {track.year && <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#78716C]">· {track.year}</span>}
        </div>
        <div>
          <h3 className="font-serif text-3xl leading-tight tracking-tight text-[#1C1917] sm:text-4xl">{track.title}</h3>
          <p className="mt-2 font-serif italic text-[#7A1A2E]">{track.artist}</p>
        </div>
        <p className="text-base leading-relaxed text-[#1C1917]/80">{track.short_description}</p>
        <div className="border-t border-[#EAE5D9] pt-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#7A1A2E]">
            {track.recurrence_type === "scoperta_curata" ? (
              "Scelta del giorno"
            ) : discoveryMode ? (
              `Tratto dall'edizione del ${italianMonthDay(dateKey)}`
            ) : (
              <>
                Perché oggi?
                {track.recurrence_type && (
                  <span className="ml-2 text-[#D4A373]">
                    · {RECURRENCE_LABEL[track.recurrence_type] || track.recurrence_type}
                  </span>
                )}
              </>
            )}
          </p>
          <p className="mt-2 font-serif text-base italic leading-relaxed text-[#1C1917]/85 sm:text-lg">{track.why_today}</p>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-[#EAE5D9] pt-5">
          <span className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-[#7A1A2E]">
            <Headphones className="h-4 w-4" strokeWidth={1.25} />
            Apri la scheda
          </span>
          <ArrowUpRight className="h-5 w-5 text-[#1C1917] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#7A1A2E]" strokeWidth={1.25} />
        </div>
      </div>
    </Link>
  );
};

export default TrackCard;