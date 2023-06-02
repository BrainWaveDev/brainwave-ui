import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Listen for route changes and set loadingPage state.
 */
export default function useRouteChange() {
  const router = useRouter();

  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoadingPage(true);
    const handleComplete = () => setLoadingPage(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return [loadingPage, setLoadingPage] as [boolean, (loading: boolean) => void];
}
