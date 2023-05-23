import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export default function useThemeDetector(): [
  boolean,
  Dispatch<SetStateAction<boolean>>
] {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const mqListener = (e: MediaQueryListEvent) => {
    if (document && document.documentElement) {
      document.documentElement.setAttribute(
        'data-theme',
        e.matches ? 'dark' : 'light'
      );
      setIsDarkTheme(e.matches);
    }
  };

  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');

    // Set browser theme after page loads
    document.documentElement.setAttribute(
      'data-theme',
      darkThemeMq.matches ? 'dark' : 'light'
    );
    setIsDarkTheme(darkThemeMq.matches);

    // Listen for changes to browser theme
    darkThemeMq.addEventListener('change', mqListener);
    return () => darkThemeMq.removeEventListener('change', mqListener);
  }, []);
  return [isDarkTheme, setIsDarkTheme];
}
