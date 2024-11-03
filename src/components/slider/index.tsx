import React, { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  TrainContainerRecommendTrainerContainer,
  TrainContainerRecommendTrainerCard,
  TrainContainerRecommendTrainerCardImage,
  TrainContainerRecommendTrainerCardH3,
  TrainContainerRecommendTrainerCardP,
} from '../home/styles.ts';

interface SliderProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const Slider = <T,>({
  items,
  renderItem,
  autoSlide = false,
  autoSlideInterval = 3000,
}: SliderProps<T>) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    if (autoSlide) {
      const interval = setInterval(nextSlide, autoSlideInterval);
      return () => clearInterval(interval);
    }
  }, [autoSlide, autoSlideInterval, nextSlide]);

  if (items.length === 0) return null;

  return (
    <TrainContainerRecommendTrainerContainer {...handlers} style={{ overflow: 'auto', position: 'relative', maxWidth:'1130px', paddingBottom:'30px' }}>
      <TrainContainerRecommendTrainerCard
        style={{
          display: 'flex',
          flexDirection:'row',
          transition: 'transform 0.5s ease',
          transform: `translateX(-${currentSlide * 100}%)`,
          marginLeft:'10px',
        }}
      >
        {items.map((item, index) => (
          <div key={index} style={{ minWidth: '100%', marginRight:'30px' }}>
            {renderItem(item)}
          </div>
        ))}
      </TrainContainerRecommendTrainerCard>
    </TrainContainerRecommendTrainerContainer>
  );
};

export default Slider;
