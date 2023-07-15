import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/utils/supabase-client';
import PasswordReset from '@/components/ui/PasswordReset';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import classNames from 'classnames';
import { RotatingLines } from 'react-loader-spinner';
import Logo from '@/components/icons/Logo';
import { getURL } from '@/utils/helpers';

export default function PasswordResetPage() {
  const router = useRouter();
  const [displayPasswordReset, setDisplayPasswordReset] = useState(false);
  const displayPasswordResetRef = useRef(displayPasswordReset);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        setDisplayPasswordReset(true);
        displayPasswordResetRef.current = true;
      }
    });

    // Logout user if the password reset event doesn't happen in first five seconds
    setTimeout(() => {
      if (!displayPasswordResetRef.current) router.push('/signin');
    }, 5000);

    // Logout the user on component unmount
    return () => {
      if (displayPasswordReset) supabase.auth.signOut();
    };
  }, []);

  return (
    <>
      <NextSeo
        nofollow={true}
        noindex={true}
        canonical={`${getURL()}/password-reset`}
      />
      <div className="flex flex-col justify-between w-[30rem] max-w-[90%] sm:max-w-full p-3 m-auto">
        <div className="w-full flex justify-center pb-3 -mt-[64px]">
          <Logo width="64px" height="64px" className={'fill-[#2e2e2e]'} />
        </div>
        {displayPasswordReset ? (
          <PasswordReset />
        ) : (
          <div
            className={classNames(
              'h-56 flex justify-center items-center',
              'pointer-events-none'
            )}
          >
            <RotatingLines
              strokeColor="#9ca3af"
              strokeWidth="2"
              animationDuration="1"
              width="3rem"
              visible={true}
            />
          </div>
        )}
      </div>
    </>
  );
}
