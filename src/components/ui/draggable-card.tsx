import { motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useRef } from 'react';

interface DraggableCardBodyProps {
  children: React.ReactNode;
  className?: string;
  onShake?: () => void;
}

export function DraggableCardBody({ children, className = '', onShake }: DraggableCardBodyProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  // Shake detection
  const lastX = useRef(0);
  const lastDir = useRef(0);
  const dirChanges = useRef(0);
  const lastTime = useRef(Date.now());

  const handleDrag = (_: unknown, info: { point: { x: number } }) => {
    const now = Date.now();
    const dx = info.point.x - lastX.current;
    const dt = now - lastTime.current;

    if (dt < 80 && Math.abs(dx) > 10) {
      const dir = dx > 0 ? 1 : -1;
      if (dir !== lastDir.current) {
        dirChanges.current += 1;
        lastDir.current = dir;
        if (dirChanges.current >= 3) {
          dirChanges.current = 0;
          onShake?.();
        }
      }
    } else {
      dirChanges.current = 0;
    }

    lastX.current = info.point.x;
    lastTime.current = now;
  };

  return (
    <motion.div
      drag
      dragElastic={0.1}
      dragMomentum={false}
      style={{ x: springX, y: springY, cursor: 'grab', position: 'relative', zIndex: 1 }}
      whileDrag={{ cursor: 'grabbing', zIndex: 50, scale: 1.03 }}
      onDrag={handleDrag}
      className={className}
    >
      {children}
    </motion.div>
  );
}
