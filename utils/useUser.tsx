import { useEffect, useState, createContext, useContext } from 'react';
import {
  useUser as useSupaUser,
  useSessionContext,
  User
} from '@supabase/auth-helpers-react';
import { UserDetails, UserProfile } from '@/types/user';
import { Subscription } from '@/types/products';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const getUserDetails = () => supabase.from('users').select('*').single();
  const getUserProfile = () => supabase.from('profile').select('*').single();
  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsloadingData(true);
      Promise.allSettled([
        getUserDetails(),
        getUserProfile(),
        getSubscription()
      ]).then((results) => {
        const userDetailsPromise = results[0];
        const userProfilePromise = results[1];
        const subscriptionPromise = results[2];

        if (userDetailsPromise.status === 'fulfilled')
          setUserDetails(userDetailsPromise.value.data as UserDetails);

        if (userProfilePromise.status === 'fulfilled')
          setUserProfile(userProfilePromise.value.data as UserProfile);

        if (subscriptionPromise.status === 'fulfilled')
          setSubscription(subscriptionPromise.value.data as Subscription);

        setIsloadingData(false);
      });
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setUserProfile(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    userProfile,
    isLoading: isLoadingUser || isLoadingData,
    subscription
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
