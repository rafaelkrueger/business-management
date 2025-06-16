import { useEffect, useRef, useState } from 'react';

export default function useHideOnScroll(threshold: number = 10) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 600) return;
      const currentY = window.scrollY;
      if (currentY > lastY.current && currentY - lastY.current > threshold) {
        setHidden(true);
      } else if (
        currentY < lastY.current &&
        lastY.current - currentY > threshold
      ) {
        setHidden(false);
      }
      lastY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return hidden;
}
