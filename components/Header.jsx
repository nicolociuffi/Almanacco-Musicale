import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { HEADER } from "@/constants/testIds";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";

const LINKS = [
  { to: "/", label: "Oggi", testId: HEADER.navHome, end: true },
  { to: "/archivio", label: "Calendario", testId: HEADER.navArchivio },
  { to: "/viaggio", label: "Il mio viaggio", testId: HEADER.navViaggio },
  { to: "/preferiti", label: "Preferiti", testId: HEADER.navPreferiti },
  { to: "/chi", label: "Cos'è", testId: HEADER.navChi }
];

const desktopClass = ({ isActive }) =>
  ["px-3 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-300 sm:text-sm", isActive ? "text-[#7A1A2E]" : "text-[#57534E] hover:text-[#1C1917]"].join(" ");

const mobileClass = ({ isActive }) =>
  ["block py-3 font-serif text-2xl tracking-tight transition-colors", isActive ? "text-[#7A1A2E]" : "text-[#1C1917] hover:text-[#7A1A2E]"].join(" ");

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header data-testid={HEADER.root} className="sticky top-0 z-40 w-full border-b border-[#EAE5D9] bg-[#FDFBF7]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
        <Link to="/" data-testid={HEADER.logo} className="group flex items-baseline gap-3">
          <span className="font-serif text-2xl tracking-tight text-[#1C1917] sm:text-3xl">Almanacco</span>
          <span className="hidden font-serif text-2xl italic text-[#7A1A2E] sm:inline-block sm:text-3xl">Musicale</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex md:gap-2">
          {LINKS.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end} data-testid={link.testId} className={desktopClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden" data-testid="nav-mobile-trigger">
            <button type="button" aria-label="Apri menu di navigazione" className="flex h-10 w-10 items-center justify-center text-[#1C1917]">
              <Menu className="h-6 w-6" strokeWidth={1.25} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" data-testid="nav-mobile-sheet" className="w-[80%] max-w-sm border-l border-[#EAE5D9] bg-[#FDFBF7] px-8 py-12">
            <SheetTitle className="sr-only">Menu di navigazione</SheetTitle>
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[#7A1A2E]">Almanacco Musicale</p>
            <nav className="mt-8 flex flex-col divide-y divide-[#EAE5D9]">
              {LINKS.map(link => (
                <NavLink key={link.to} to={link.to} end={link.end} data-testid={`${link.testId}-mobile`} onClick={() => setOpen(false)} className={mobileClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;