import React, { memo, useState } from 'react';
import {
  signoutUser,
  updatePassword,
  validatePassword
} from '@/utils/app/userSettings';
import classNames from 'classnames';
// @ts-ignore
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { RotatingLines } from 'react-loader-spinner';
import LockIcon from '@/components/icons/LockIcon';

const PasswordTab = memo(
  ({
    userEmail,
    setError
  }: {
    userEmail?: string;
    setError: (errorMessage: string) => void;
  }) => {
    // ==== Page Refresh ====
    const router = useRouter();

    // ==== Password Update ====
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [currentPasswordError, setCurrentPasswordError] =
      useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const onUpdatePassword = async () => {
      if (!userEmail) return;
      if (newPassword !== confirmNewPassword) return;

      setLoading(true);

      try {
        await validatePassword(userEmail, currentPassword);
        if (currentPasswordError) setCurrentPasswordError(false);
      } catch (e) {
        setCurrentPasswordError(true);
        setLoading(false);
        return;
      }

      try {
        await updatePassword(newPassword);
      } catch (e) {
        setError("Couldn't update password");
        setLoading(false);
        return;
      }

      setLoading(false);
      await signoutUser();
      router.reload();
    };

    // ==== Tailwind Classes ====
    const InputClasses = (field: string) =>
      classNames(
        'w-full h-13 px-3.5 border-0 text-base',
        'text-neutral7 outline-none transition-all duration-300 placeholder:text-neutral4/50',
        field.length > 0 ? 'bg-transparent' : 'bg-neutral2 dark:bg-neutral6',
        'focus:bg-transparent dark:text-neutral3 overflow-hidden rounded-lg',
        'pl-[3.125rem] font-semibold focus:ring-0 focus:outline-0',
        'border-2 border-neutral2 dark:border-neutral6 focus:border-transparent'
      );

    const IconClasses = (field: string) =>
      classNames(
        'inline-block w-6 h-6 absolute top-2.5 left-3.5',
        'pointer-events-none transition-colors duration-300',
        field.length > 0 ? 'fill-neutral4' : 'fill-neutral4/50'
      );

    return (
      <div className="w-full h-full">
        <h1 className="mb-8 text-3xl md:mb-6 font-semibold text-neutral7 dark:text-neutral1">
          Password
        </h1>
        <div>
          <p className="font-semibold mb-2 text-sm text-neutral7 dark:text-neutral1">
            Current password
          </p>
          <div className="border border-neutral2 dark:border-neutral6 rounded-xl relative mb-3">
            <input
              type="password"
              className={InputClasses(currentPassword)}
              placeholder={'Current password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <LockIcon className={IconClasses(currentPassword)} />
          </div>
          <AnimatePresence>
            {currentPasswordError && (
              <motion.p
                className="text-red-500 text-sm mt-0 mb-0"
                initial={{ opacity: 0, display: 'none' }}
                animate={{ opacity: 1, display: 'block' }}
                exit={{ opacity: 0, display: 'none' }}
                key={'CurrentPasswordError'}
              >
                Incorrect password
              </motion.p>
            )}
          </AnimatePresence>

          <p className="font-semibold mt-5 mb-2 text-sm text-neutral7 dark:text-neutral1">
            New password
          </p>
          <div className="border border-neutral2 dark:border-neutral6 rounded-xl relative mb-2">
            <input
              type="password"
              className={InputClasses(newPassword)}
              placeholder={'New password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (
                  e.target.value.length > 0 &&
                  e.target.value === confirmNewPassword
                )
                  setPasswordMismatch(false);
              }}
            />
            <LockIcon className={IconClasses(newPassword)} />
          </div>
          <p className="mt-0 text-sm text-neutral4/50">Minimum 8 characters</p>

          <p className="font-semibold mt-6 mb-2 text-sm text-neutral7 dark:text-neutral1">
            Confirm new password
          </p>
          <div className="border border-neutral2 dark:border-neutral6 rounded-xl relative mb-2">
            <input
              type="password"
              className={InputClasses(confirmNewPassword)}
              placeholder={'New password'}
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
                if (e.target.value.length > 0 && e.target.value !== newPassword)
                  setPasswordMismatch(true);
                else setPasswordMismatch(false);
              }}
            />
            <LockIcon className={IconClasses(confirmNewPassword)} />
          </div>
          <AnimatePresence initial={false}>
            {passwordMismatch ? (
              <motion.p
                className="text-red-500 text-sm mt-0 mb-0"
                initial={{ opacity: 0, display: 'none' }}
                animate={{ opacity: 1, display: 'block' }}
                exit={{ opacity: 0, display: 'none' }}
                key={'PasswordMismatchError'}
              >
                Password not match
              </motion.p>
            ) : (
              <motion.p
                className="text-sm text-neutral4/50 mt-0 mb-0"
                initial={{ opacity: 0, display: 'none' }}
                animate={{ opacity: 1, display: 'block' }}
                exit={{ opacity: 0, display: 'none' }}
                key={'PasswordHelperText'}
              >
                Minimum 8 characters
              </motion.p>
            )}
          </AnimatePresence>
          <button
            className={classNames(
              'mt-8 w-full bg-teal-400 text-white font-bold',
              'hover:bg-teal-400/80 active:bg-teal-400/80',
              'text-sm px-6 py-3 rounded-xl outline-none focus:outline-none mr-1 mb-1',
              'transition-all duration-300 ease-in flex items-center justify-center',
              loading ? 'cursor-wait' : 'cursor-pointer'
            )}
            type="button"
            onClick={onUpdatePassword}
            disabled={loading}
          >
            {loading ? (
              <RotatingLines
                strokeColor="white"
                strokeWidth="2"
                animationDuration="1"
                width="1.5rem"
                visible={true}
              />
            ) : (
              'Change password'
            )}
          </button>
        </div>
      </div>
    );
  }
);

export default PasswordTab;
