import archiveData from '../data/archive.json';

export async function fetchArchive() {
  return archiveData;
}

export async function fetchDaily(dateStr) {
  let targetKey = dateStr;
  if (!targetKey) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    targetKey = `${mm}-${dd}`;
  }
  
  const found = archiveData.find(d => d.date_key === targetKey);
  if (found) return found;
  
  return archiveData[0];
}

export async function fetchTrack(trackId) {
  for (const day of archiveData) {
    if (day.classical && day.classical.id === trackId) {
      return { track: day.classical, day_context: day };
    }
    if (day.modern && day.modern.id === trackId) {
      return { track: day.modern, day_context: day };
    }
  }
  throw new Error("Brano non trovato");
}

export async function fetchGiornata(dateKey) {
  const found = archiveData.find(d => d.date_key === dateKey);
  if (found) return found;
  throw new Error("Giornata non trovata");
}

export async function fetchTracksBulk(ids) {
  if (!ids || ids.length === 0) return [];
  const results = [];
  for (const id of ids) {
    try {
      const res = await fetchTrack(id);
      results.push(res);
    } catch {}
  }
  return results;
}

export async function enrichTrack(trackId) {
  return {
    text: "Approfondimento culturale salvato nella scheda del brano."
  };
}