const KEY_FAVORITES = "almanacco:favorites";
const KEY_HISTORY = "almanacco:history";

function readJSON(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("almanacco:storage", { detail: { key } }));
  } catch {}
}

export function getFavorites() {
  return readJSON(KEY_FAVORITES, []);
}

export function isFavorite(trackId) {
  return getFavorites().includes(trackId);
}

export function toggleFavorite(trackId) {
  const current = getFavorites();
  const next = current.includes(trackId) ? current.filter(id => id !== trackId) : [trackId, ...current];
  writeJSON(KEY_FAVORITES, next);
  return next.includes(trackId);
}

export function getHistory() {
  return readJSON(KEY_HISTORY, []);
}

export function recordListen(track) {
  const entry = {
    trackId: track.id,
    category: track.category,
    title: track.title,
    artist: track.artist,
    genre: track.genre,
    era: track.era || null,
    country: track.country || null,
    artist_gender: track.artist_gender || "unknown",
    recurrence_type: track.recurrence_type || null,
    listenedAt: new Date().toISOString()
  };
  const history = getHistory().filter(h => h.trackId !== track.id);
  writeJSON(KEY_HISTORY, [entry, ...history].slice(0, 500));
}

export function clearAllJourney() {
  writeJSON(KEY_HISTORY, []);
  writeJSON(KEY_FAVORITES, []);
}

export function subscribeStorage(callback) {
  window.addEventListener("almanacco:storage", callback);
  return () => window.removeEventListener("almanacco:storage", callback);
}