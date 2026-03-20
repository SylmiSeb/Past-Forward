import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PolaroidCard from './components/PolaroidCard';
import Footer from './components/Footer';
import { generateAllDecades } from './services/geminiService';
import { createAlbumPage } from './lib/albumUtils';

/* ── Constants ── */
const DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'];

const EFFECT_CLASSES: Record<string, string> = {
  '1950s': 'effect-1950s',
  '1960s': 'effect-1960s',
  '1970s': 'effect-1970s',
  '1980s': 'effect-1980s',
  '1990s': 'effect-1990s',
  '2000s': 'effect-2000s',
};

// Fixed positions (desktop layout) — CSS classes via Tailwind arbitrary values not available,
// so we use inline style offsets for the idle ghost polaroids
const IDLE_POSITIONS = [
  { x: -340, y: -60, rotate: -8 },
  { x: -170, y: 30, rotate: 4 },
  { x: 0, y: -40, rotate: -3 },
  { x: 170, y: 20, rotate: 6 },
  { x: 340, y: -55, rotate: -5 },
  { x: 80, y: 120, rotate: 2 },
];

type AppState = 'idle' | 'image-uploaded' | 'generating' | 'results-shown';

interface DecadeCard {
  decade: string;
  state: 'pending' | 'done' | 'error';
  imageUrl?: string;
  error?: string;
}

/* ── Hook — detect mobile ── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [cards, setCards] = useState<DecadeCard[]>(
    DECADES.map((d) => ({ decade: d, state: 'pending' }))
  );
  const [downloadingAlbum, setDownloadingAlbum] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  /* ── File handling ── */
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUserImageUrl(result);
      setAppState('image-uploaded');
      setCards(DECADES.map((d) => ({ decade: d, state: 'pending' })));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  /* ── Generation ── */
  const startGeneration = useCallback(
    async (imageDataUrl: string, decades: string[]) => {
      setAppState('generating');
      setCards((prev) =>
        prev.map((c) =>
          decades.includes(c.decade) ? { ...c, state: 'pending', imageUrl: undefined, error: undefined } : c
        )
      );

      await generateAllDecades(
        imageDataUrl,
        decades,
        (decade, result) => {
          setCards((prev) =>
            prev.map((c) =>
              c.decade === decade
                ? {
                    ...c,
                    state: result.url ? 'done' : 'error',
                    imageUrl: result.url,
                    error: result.error,
                  }
                : c
            )
          );
        },
        2
      );

      setAppState('results-shown');
    },
    []
  );

  const handleGenerate = () => {
    if (!userImageUrl) return;
    startGeneration(userImageUrl, DECADES);
  };

  const handleRegenerate = (decade: string) => {
    if (!userImageUrl) return;
    startGeneration(userImageUrl, [decade]);
  };

  /* ── Album download ── */
  const handleDownloadAlbum = async () => {
    const doneCards = cards.filter((c) => c.state === 'done' && c.imageUrl);
    if (doneCards.length === 0) return;
    setDownloadingAlbum(true);
    try {
      const dataUrl = await createAlbumPage(
        doneCards.map((c) => ({ url: c.imageUrl!, decade: c.decade }))
      );
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'past-forward-album.png';
      a.click();
    } finally {
      setDownloadingAlbum(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white flex flex-col">
      {/* Header */}
      <header className="pt-10 pb-4 text-center">
        <h1
          className="text-5xl md:text-6xl font-bold text-amber-300 drop-shadow-lg"
          style={{ fontFamily: '"Permanent Marker", cursive' }}
        >
          Past Forward
        </h1>
        <p className="mt-2 text-stone-400 text-lg">
          See yourself through every decade — 1950s to 2000s
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center px-4">
        {/* ── IDLE STATE ── */}
        <AnimatePresence>
          {appState === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8 mt-8"
            >
              {/* Ghost polaroids */}
              {!isMobile && (
                <div className="relative h-64 w-full flex items-center justify-center">
                  {IDLE_POSITIONS.map((pos, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-40 bg-white/10 rounded-sm shadow-lg"
                      style={{
                        x: pos.x,
                        y: pos.y,
                        rotate: pos.rotate,
                        aspectRatio: '5/6',
                      }}
                      animate={{ y: [pos.y, pos.y - 8, pos.y] }}
                      transition={{
                        duration: 3 + i * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Upload zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-amber-400/60 hover:border-amber-400 rounded-xl px-12 py-10 text-center transition-colors"
              >
                <p className="text-amber-300 text-xl font-semibold mb-1">Upload your photo</p>
                <p className="text-stone-400 text-sm">Drag & drop or click to browse</p>
                <p className="text-stone-500 text-xs mt-2">JPG, PNG, WEBP · Max 10 MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── IMAGE UPLOADED STATE ── */}
        <AnimatePresence>
          {appState === 'image-uploaded' && userImageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 mt-8"
            >
              <div className="bg-white p-3 pb-10 shadow-2xl rounded-sm rotate-1 w-56">
                <img
                  src={userImageUrl}
                  alt="Your photo"
                  className="w-full aspect-square object-cover"
                />
                <p
                  className="mt-2 text-center text-stone-700 text-lg"
                  style={{ fontFamily: '"Permanent Marker", cursive' }}
                >
                  You — Now
                </p>
              </div>

              <button
                onClick={handleGenerate}
                className="bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-lg px-8 py-3 rounded-full shadow-lg transition-colors"
              >
                Generate ✨
              </button>

              <button
                onClick={() => {
                  setUserImageUrl(null);
                  setAppState('idle');
                }}
                className="text-stone-500 hover:text-stone-300 text-sm underline"
              >
                Choose another photo
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── GENERATING & RESULTS ── */}
        {(appState === 'generating' || appState === 'results-shown') && (
          <div className="w-full max-w-6xl mt-8">
            {/* Grid of polaroid cards */}
            <div
              className={
                isMobile
                  ? 'flex flex-col gap-8'
                  : 'grid grid-cols-3 gap-8 justify-items-center'
              }
            >
              {cards.map((card) => (
                <PolaroidCard
                  key={card.decade}
                  decade={card.decade}
                  imageUrl={card.imageUrl}
                  error={card.error}
                  state={card.state}
                  effectClass={EFFECT_CLASSES[card.decade]}
                  isMobile={isMobile}
                  onRegenerate={() => handleRegenerate(card.decade)}
                />
              ))}
            </div>

            {/* Download album button */}
            {appState === 'results-shown' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-10 gap-4 flex-wrap"
              >
                <button
                  onClick={handleDownloadAlbum}
                  disabled={downloadingAlbum}
                  className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-900 font-bold text-lg px-8 py-3 rounded-full shadow-lg transition-colors"
                >
                  {downloadingAlbum ? 'Creating album…' : '📷 Download Album'}
                </button>
                <button
                  onClick={() => {
                    setUserImageUrl(null);
                    setAppState('idle');
                    setCards(DECADES.map((d) => ({ decade: d, state: 'pending' })));
                  }}
                  className="bg-stone-700 hover:bg-stone-600 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg transition-colors"
                >
                  Start over
                </button>
              </motion.div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
