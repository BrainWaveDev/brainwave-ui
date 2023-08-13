import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Logo from '@/components/icons/Logo';
import { getURL } from '@/utils/helpers';
import { RotatingLines } from 'react-loader-spinner';
import classNames from 'classnames';
import useThemeDetector from '../hooks/useThemeDetector';
import { NextSeo } from 'next-seo';

const SignIn = () => {
  // Redirect to main page if user is already signed in
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  useEffect(() => {
    if (user) router.replace('/chat');
  }, [user]);

  // === Detect theme ===
  useThemeDetector();

  return (
    <>
      <NextSeo
        nofollow={true}
        title="Sign In"
        description="Sign in to your BrainWave account to access your personalinzed AI assistant"
        canonical={`${getURL()}signin`}
      />
      <div className="flex h-fit min-w-[100vw] justify-center align-middle self-center">
        <div className="flex justify-center md:height-screen-helper min-w-full">
          <div
            className={classNames(
              'flex flex-col p-3 w-[30rem] max-w-[90%] sm:max-w-full',
              'justify-between m-auto'
            )}
          >
            <div className="flex justify-center pb-2">
              <Logo width="64px" height="64px" />
            </div>
            <div className="flex flex-col space-y-4 items-center children:w-full">
              {!user ? (
                <Auth
                  supabaseClient={supabaseClient}
                  providers={['google', 'github']}
                  magicLink={true}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          defaultButtonBackground: 'white',
                          defaultButtonText: 'black'
                        },
                        fonts: {
                          bodyFontFamily: '',
                          buttonFontFamily: '',
                          inputFontFamily: '',
                          labelFontFamily: ''
                        },
                        fontSizes: {
                          baseBodySize: '14px',
                          baseInputSize: '15px',
                          baseLabelSize: '15px',
                          baseButtonSize: '15px'
                        },
                        space: {
                          spaceSmall: '4px',
                          spaceMedium: '8px',
                          spaceLarge: '16px'
                        },
                        radii: {
                          borderRadiusButton: '10px',
                          buttonBorderRadius: '10px',
                          inputBorderRadius: '10px'
                        }
                      }
                    }
                  }}
                  localization={{
                    variables: {
                      sign_up: {
                        email_label: '',
                        password_label: '',
                        email_input_placeholder: 'Email',
                        password_input_placeholder: 'Password',
                        button_label: 'Sign up',
                        loading_button_label: 'Signing up ...',
                        social_provider_text: 'Continue with {{provider}}',
                        link_text: "Don't have an account? Sign up",
                        confirmation_text:
                          'Check your email for the confirmation link'
                      },
                      sign_in: {
                        email_label: '',
                        password_label: '',
                        email_input_placeholder: 'Email',
                        password_input_placeholder: 'Password',
                        button_label: 'Sign in',
                        loading_button_label: 'Signing in ...',
                        social_provider_text: 'Continue with {{provider}}',
                        link_text: 'Already have an account? Sign in'
                      },
                      magic_link: {
                        email_input_label: '',
                        email_input_placeholder: 'Email',
                        button_label: 'Send Magic Link',
                        loading_button_label: 'Sending Magic Link ...',
                        link_text: 'Send a magic link email',
                        confirmation_text: 'Check your email for the magic link'
                      },
                      forgotten_password: {
                        email_label: '',
                        password_label: '',
                        email_input_placeholder: 'Email',
                        button_label: 'Send reset password instructions',
                        loading_button_label: 'Sending reset instructions ...',
                        link_text: 'Forgot your password?',
                        confirmation_text:
                          'Check your email for the password reset link'
                      },
                      update_password: {
                        password_label: '',
                        password_input_placeholder: 'Your new password',
                        button_label: 'Update password',
                        loading_button_label: 'Updating password ...',
                        confirmation_text: 'Your password has been updated'
                      }
                    }
                  }}
                  theme={'minimal'}
                />
              ) : (
                <div
                  className={classNames(
                    'h-96 flex justify-center items-center',
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
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
