import React from "react";
import { Link } from "react-router-dom";
import { BookOpenText, Compass, GraduationCap, Headphones, Music2 } from "lucide-react";
import { CHI } from "@/constants/testIds";

const Chi = () => {
  return (
    <div data-testid={CHI.page} className="bg-[#FDFBF7]">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-12 lg:py-24">
        <p className="font-sans text-xs uppercase tracking-[0.32em] text-[#7A1A2E]">Cos'è Almanacco Musicale</p>
        <h1 data-testid={CHI.title} className="mt-5 font-serif text-4xl leading-none tracking-tighter text-[#1C1917] sm:text-5xl lg:text-6xl">
          Ascoltare per <span className="italic text-[#7A1A2E]">conoscere.</span>
        </h1>
        <article className="mt-10 max-w-3xl space-y-6 font-serif text-lg leading-relaxed text-[#1C1917]/90 sm:text-xl">
          <p className="leading-relaxed">
            Almanacco Musicale nasce dall'idea che ascoltare musica sia anche un modo per conoscere storie, persone e culture.
          </p>
          <p>Ogni giorno propone due ascolti:</p>
        </article>
        <div className="mt-10 grid grid-cols-1 gap-px bg-[#EAE5D9] sm:grid-cols-2">
          <div className="flex items-start gap-4 bg-white p-6 sm:p-8">
            <Music2 className="mt-1 h-6 w-6 flex-shrink-0 text-[#7A1A2E]" strokeWidth={1.25} />
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#7A1A2E]">Ascolto 1</p>
              <p className="mt-2 font-serif text-lg text-[#1C1917] sm:text-xl">Un brano dalla musica classica</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white p-6 sm:p-8">
            <Headphones className="mt-1 h-6 w-6 flex-shrink-0 text-[#7A1A2E]" strokeWidth={1.25} />
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#7A1A2E]">Ascolto 2</p>
              <p className="mt-2 font-serif text-lg text-[#1C1917] sm:text-xl">Un brano dagli altri mondi musicali</p>
            </div>
          </div>
        </div>
        <article className="mt-10 max-w-3xl space-y-6 font-serif text-lg leading-relaxed text-[#1C1917]/90 sm:text-xl">
          <p>Ogni scelta è accompagnata da un breve racconto che spiega perché quel brano merita di essere ascoltato.</p>
          <p>Almanacco Musicale vuole essere un viaggio quotidiano attraverso generi, epoche, paesi e voci diverse.</p>
        </article>
        <div className="mt-16 flex items-center gap-4">
          <span className="h-px flex-1 bg-[#EAE5D9]"></span>
          <BookOpenText className="h-4 w-4 text-[#D4A373]" strokeWidth={1.25} />
          <span className="h-px flex-1 bg-[#EAE5D9]"></span>
        </div>
        <section data-testid={CHI.nota} className="mt-12 border-l-4 border-[#D4A373] bg-white p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-[#7A1A2E]" strokeWidth={1.25} />
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#7A1A2E]">Nota del curatore</p>
          </div>
          <h2 data-testid={CHI.notaTitle} className="mt-4 font-serif text-3xl italic leading-tight text-[#1C1917] sm:text-4xl">
            Ascolto dunque sono
          </h2>
          <p className="mt-6 font-serif text-lg leading-relaxed text-[#1C1917]/90 sm:text-xl">
            <strong className="font-semibold text-[#1C1917]">
              Almanacco Musicale è un progetto ideato dal prof. Nicolò Ciuffi, docente di musica nella Scuola Secondaria di I°.
            </strong>
          </p>
          <p className="mt-4 font-serif text-lg leading-relaxed text-[#1C1917]/90 sm:text-xl">
            La proposta nasce dall'idea che ogni giorno possa essere un'occasione per scoprire una nuova storia musicale: un viaggio attraverso epoche, generi, culture e voci diverse.
          </p>
          <p className="mt-4 font-serif text-lg leading-relaxed text-[#1C1917]/90 sm:text-xl">
            <strong className="font-semibold text-[#1C1917]">
              Il progetto è nato per accompagnare gli studenti e le studentesse alla scoperta della musica, dentro e oltre il percorso scolastico.
            </strong>
          </p>
        </section>
        <div className="mt-16 flex flex-wrap items-center gap-4">
          <Link to="/" data-testid={CHI.backHome} className="inline-flex items-center gap-3 bg-[#7A1A2E] px-6 py-3 font-sans text-xs uppercase tracking-[0.32em] text-[#FDFBF7] transition hover:bg-[#5A1121]">
            <Compass className="h-4 w-4" strokeWidth={1.25} />
            Vai all'edizione di oggi
          </Link>
          <Link to="/archivio" data-testid={CHI.backCalendar} className="inline-flex items-center gap-3 border border-[#7A1A2E] px-6 py-3 font-sans text-xs uppercase tracking-[0.32em] text-[#7A1A2E] transition hover:bg-[#7A1A2E] hover:text-[#FDFBF7]">
            Sfoglia il calendario
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Chi;