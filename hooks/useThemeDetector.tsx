import { useEffect } from 'react';
import { useAppDispatch } from '../context/redux/store';
import { setTheme } from '../context/redux/themeSlice';

type Theme = 'dark' | 'light';

/**
 * Detects the user's preferred theme and sets it in the Redux store.
 * Attaches a listener to the browser's media query for dark mode to
 * update theme based on the browser's theme.
 */
export default function useThemeDetector() {
  const dispatch = useAppDispatch();

  const mqListener = (e: MediaQueryListEvent) => {
    if (document && document.documentElement) {
      const theme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      dispatch(setTheme(theme as Theme));
    }
  };

  useEffect(() => {
    // Read theme from local storage
    let preferredTheme = localStorage.getItem('preferredTheme');
    // Read document media query
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    // If no preferred theme is set, use the system preference
    if (!preferredTheme)
      preferredTheme = darkThemeMq.matches ? 'dark' : 'light';

    // Set browser theme after page loads
    document.documentElement.setAttribute('data-theme', preferredTheme);
    // Update Redux store
    dispatch(setTheme(preferredTheme as Theme));

    // Listen for changes to browser theme
    darkThemeMq.addEventListener('change', mqListener);
    return () => darkThemeMq.removeEventListener('change', mqListener);
  }, []);
}
