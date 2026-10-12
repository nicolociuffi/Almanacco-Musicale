import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import TrackDetail from '@/pages/TrackDetail';
import Archivio from '@/pages/Archivio';
import Viaggio from '@/pages/Viaggio';
import Preferiti from '@/pages/Preferiti';
import Giornata from '@/pages/Giornata';
import Chi from '@/pages/Chi';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1C1917]">
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brano/:trackId" element={<TrackDetail />} />
            <Route path="/giornata/:dateKey" element={<Giornata />} />
            <Route path="/archivio" element={<Archivio />} />
            <Route path="/viaggio" element={<Viaggio />} />
            <Route path="/preferiti" element={<Preferiti />} />
            <Route path="/chi" element={<Chi />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      <Toaster position="bottom-right" />
    </div>
  );
}