import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { DraggableCardBody } from './ui/draggable-card';
import { createPolaroidImage } from '../lib/albumUtils';
import { cn } from '../lib/utils';

type CardState = 'pending' | 'done' | 'error';

interface PolaroidCardProps {
  decade: string;
  imageUrl?: string;
  error?: string;
  state: CardState;
  effectClass?: string;
  isMobile: boolean;
  onRegenerate: () => void;
}

export default function PolaroidCard({
  decade,
  imageUrl,
  error,
  state,
  effectClass,
  isMobile,
  onRegenerate,
}: PolaroidCardProps) {
  const [developing, setDeveloping] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | undefined>(undefined);

  // Trigger "developing" animation whenever a new image arrives
  useEffect(() => {
    if (state === 'done' && imageUrl) {
      setDeveloping(true);
      const t = setTimeout(() => setDeveloping(false), 3500);
      return () => clearTimeout(t);
    }
  }, [imageUrl, state]);

  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;
    const dataUrl = await createPolaroidImage(imageUrl, decade);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `past-forward-${decade}.png`;
    a.click();
  }, [imageUrl, decade]);

  const toggleEffect = () => {
    setActiveEffect((prev) => (prev ? undefined : effectClass));
  };

  const inner = (
    <div
      className={cn(
        'relative flex flex-col bg-white rounded-sm select-none',
        'w-56 shadow-xl',
        isMobile ? 'mx-auto' : ''
      )}
      style={{ padding: '12px 12px 48px 12px' }}
    >
      {/* Photo area */}
      <div className="relative w-full overflow-hidden bg-stone-200" style={{ aspectRatio: '1/1' }}>
        {state === 'pending' && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {state === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 gap-2">
            <span className="text-red-500 text-4xl">✕</span>
            <p className="text-xs text-stone-400 text-center px-2">{error ?? 'Generation failed'}</p>
          </div>
        )}

        {state === 'done' && imageUrl && (
          <>
            <img
              src={imageUrl}
              alt={`${decade} style`}
              className={cn('w-full h-full object-cover', activeEffect)}
            />
            {/* Developing overlay */}
            <AnimatePresence>
              {developing && (
                <motion.div
                  className="absolute inset-0 bg-amber-950"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 3.5, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Caption */}
      <p
        className="mt-2 text-center font-permanent-marker text-stone-700 text-lg leading-none"
        style={{ fontFamily: '"Permanent Marker", cursive' }}
      >
        {decade}
      </p>

      {/* Action buttons */}
      <div
        className={cn(
          'absolute bottom-1 right-1 flex gap-1',
          isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'
        )}
      >
        {state === 'done' && (
          <>
            <button
              onClick={toggleEffect}
              title="Toggle decade effect"
              className="w-7 h-7 rounded-full bg-white/80 hover:bg-amber-100 text-xs flex items-center justify-center shadow"
            >
              ⭐
            </button>
            <button
              onClick={handleDownload}
              title="Download polaroid"
              className="w-7 h-7 rounded-full bg-white/80 hover:bg-amber-100 text-xs flex items-center justify-center shadow"
            >
              ⬇️
            </button>
          </>
        )}
        <button
          onClick={onRegenerate}
          title="Regenerate"
          className="w-7 h-7 rounded-full bg-white/80 hover:bg-amber-100 text-xs flex items-center justify-center shadow"
        >
          🔄
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return <div className="group">{inner}</div>;
  }

  return (
    <div className="group">
      <DraggableCardBody onShake={onRegenerate}>{inner}</DraggableCardBody>
    </div>
  );
}
