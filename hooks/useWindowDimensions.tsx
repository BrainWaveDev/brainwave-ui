import { useState, useEffect } from 'react';

type Dimensions = {
  width: number;
  height: number;
};

export default function useWindowDimensions(): [
  number | undefined,
  number | undefined
] {
  const [windowDimensions, setWindowDimensions] = useState<Dimensions | null>(
    null
  );

  const updateWindowDimensions = () => {
    if (window) {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  };

  useEffect(() => {
    if (window) {
      updateWindowDimensions();
      window.addEventListener('resize', updateWindowDimensions);
      return () => window.removeEventListener('resize', updateWindowDimensions);
    }
  }, []);

  return [windowDimensions?.height, windowDimensions?.height];
}
