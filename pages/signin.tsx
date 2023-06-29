import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import LoadingDots from '@/components/ui/LoadingDots';
import Logo from '@/components/icons/Logo';
import { getURL } from '@/utils/helpers';

const SignIn = () => {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  if (!user)
    return (
      <div className='flex min-h-screen min-w-[100vw] justify-center align-middle'>
        <div className="flex justify-center height-screen-helper">
          <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
            <div className="flex justify-center pb-12 ">
              <Logo width="64px" height="64px" />
            </div>
            <div className="flex flex-col space-y-4">
              <Auth
                supabaseClient={supabaseClient}
                providers={['google', 'github']}
                redirectTo={getURL()}
                magicLink={true}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: 'rgb(50,65,89)',
                        brandAccent: 'rgb(50,65,89)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
};

export default SignIn;
