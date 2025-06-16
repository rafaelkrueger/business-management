import { useEffect, useRef, useState } from 'react';

export default function useHideOnScroll(threshold: number = 10) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const container = document.getElementById('main-content');
    const target: HTMLElement | Window = container || window;

    const getScrollY = () =>
      target === window ? window.scrollY : (target as HTMLElement).scrollTop;

    const handleScroll = () => {
      if (window.innerWidth > 600) return;
      const currentY = getScrollY();
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

    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return hidden;
}
