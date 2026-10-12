import React from "react";
import { Link } from "react-router-dom";
import { CHI } from "@/constants/testIds";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-[#EAE5D9] bg-[#FDFBF7]">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-12 sm:flex-row sm:items-end sm:justify-between lg:px-12">
        <div className="max-w-md">
          <p className="font-serif text-2xl tracking-tight text-[#1C1917] sm:text-3xl">Almanacco Musicale</p>
          <p className="mt-2 text-sm leading-relaxed text-[#78716C]">
            Un viaggio quotidiano nella memoria della musica, dal canto gregoriano al pop. Due ascolti al giorno, scelti tra anniversari e ricorrenze.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-[#78716C]">
            Un progetto del prof. Nicolò Ciuffi —{" "}
            <Link to="/chi" data-testid={CHI.footerLink} className="border-b border-[#D4A373] text-[#7A1A2E] transition hover:text-[#5A1121]">
              cos'è Almanacco Musicale
            </Link>.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#7A1A2E]">
          Tutti i generi. Tutte le voci.
        </p>
      </div>
    </footer>
  );
};

export default Footer;