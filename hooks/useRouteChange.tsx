import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from '../context/redux/store';
import { clearSelectedConversation } from '../context/redux/currentConversationSlice';

/**
 * Listen for route changes and set loadingPage state.
 */
export default function useRouteChange() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      setLoadingPage(true);
      // Clear current selected conversation
      // if switching away from main page
      if (!url.includes('/')) {
        dispatch(clearSelectedConversation());
      }
    };
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
