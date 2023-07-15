import { supabase } from '@/utils/supabase-client';
import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { wait } from '@/utils/helpers';
import { useRouter } from 'next/router';
import LockIcon from '@/components/icons/LockIcon';
// @ts-ignore
import { AnimatePresence, motion } from 'framer-motion';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

function PasswordReset() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState('Reset password');

  const resetPassword = async (event: FormEvent) => {
    event.preventDefault();
    setButtonText('Resetting password...');

    if (newPassword.length === 0) {
      setErrorMessage('Please provide a valid password');
    } else if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
    } else {
      setErrorMessage('');
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (!data['user'] || error) {
        if (error) console.error(error);
        setErrorMessage('There was an error updating your password');
        setButtonText('Reset password');
      } else {
        setStatusMessage('Password updated successfully!');
        setButtonText('Reset password');
        await wait(1500);
        await supabase.auth.signOut();
        router.replace('/signin');
      }
    }
  };

  // ==== Tailwind Classes ====
  const InputClasses = (field: string) =>
    classNames(
      'w-full h-11 px-3.5 border-2 text-base',
      'outline-none transition-all duration-300 placeholder:text-neutral4/50',
      field.length > 0 ? 'bg-transparent' : 'bg-neutral6',
      'focus:bg-transparent text-neutral3 overflow-hidden rounded-[0.625rem]',
      'pl-[3.125rem] font-semibold focus:ring-0 focus:outline-0',
      'border-neutral6 focus:border-transparent'
    );

  const IconClasses = (field: string) =>
    classNames(
      'inline-block w-6 h-6 absolute top-2.5 left-3.5',
      'pointer-events-none transition-colors duration-300',
      field.length > 0 ? 'fill-neutral4' : 'fill-neutral4/50'
    );

  return (
    <>
      <form>
        <p className="font-semibold mt-6 mb-2 text-base text-neutral1">
          Reset Password
        </p>
        <div
          className={classNames(
            'border rounded-xl relative mb-2 overflow-hidden',
            'border-neutral6'
          )}
        >
          <input
            type="password"
            className={InputClasses(newPassword)}
            placeholder={'New password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <LockIcon className={IconClasses(newPassword)} />
        </div>
        <button
          type={'submit'}
          className={classNames(
            'w-full h-11 px-3.5 text-base rounded-xl',
            'font-semibold leading-6 border-2 border-neutral5',
            'focus:bg-neutral5 active:bg-neutral5 font-medium border-transparent',
            'my-4 transition-all duration-300 text-white bg-zinc-700',
            'opacity-75 hover:opacity-100 active:opacity-100'
          )}
          onClick={resetPassword}
          onSubmit={resetPassword}
        >
          {buttonText}
        </button>
      </form>
      <AnimatePresence initial={false}>
        {errorMessage && (
          <motion.p
            className="text-red-500 text-sm mt-1"
            initial={{ opacity: 0, display: 'none' }}
            animate={{ opacity: 1, display: 'flex' }}
            exit={{ opacity: 0, display: 'none' }}
            key={'ErrorMessage'}
          >
            <ExclamationCircleIcon className={'inline-block mx-1 w-5 h-5'} />
            {errorMessage}
          </motion.p>
        )}
        {statusMessage && (
          <motion.p
            className="text-sm text-neutral3 mt-0 mb-0"
            initial={{ opacity: 0, display: 'none' }}
            animate={{ opacity: 1, display: 'block' }}
            exit={{ opacity: 0, display: 'none' }}
            key={'StatusMessage'}
          >
            {statusMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}

export default PasswordReset;
