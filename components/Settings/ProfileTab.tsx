import React, { useState, Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { updateEmail, updateProfileName } from '@/utils/app/userSettings';
import { RotatingLines } from 'react-loader-spinner';
import { wait } from '@/utils/helpers';
import {
  CheckIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
// @ts-ignore
import { motion, AnimatePresence } from 'framer-motion';
import { UpdateAlert } from './SettingsDialog';

// Regex expressions for validation
const usernameRegex = /^[a-zA-Z0-9]+$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

type EmailStatus = {
  message: string;
  error: boolean;
};

const ProfileTab = ({
  username,
  setUsername,
  userEmail,
  userId,
  setUpdateAlert
}: {
  username?: string;
  setUsername: Dispatch<SetStateAction<string>>;
  userEmail?: string;
  userId?: string;
  updateUsername: (newUsername: string) => void;
  setUpdateAlert: (message: UpdateAlert | null) => void;
}) => {
  // ==== Username Update ====
  const [newUsername, setNewUsername] = useState<string>(username || '');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const onNewUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setNewUsername(newUsername);
    if (newUsername.length === 0) setUsernameError(null);
    else if (newUsername.length < 3)
      setUsernameError('Username must be at least 3 characters');
    else if (!usernameRegex.test(newUsername))
      setUsernameError('Username can only contain letters and numbers');
    else setUsernameError(null);
  };

  // ==== Email Update ====
  const [newEmail, setNewEmail] = useState<string>(userEmail || '');
  const [emailUpdate, setEmailUpdate] = useState<EmailStatus | null>(null);
  const onNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setNewEmail(newEmail);
    if (newEmail.length === 0) setEmailUpdate(null);
    else if (!emailRegex.test(newEmail))
      setEmailUpdate({ message: 'Invalid email address', error: true });
    else setEmailUpdate(null);
  };

  // ==== Loading State ====
  const [loading, setLoading] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);

  // ==== Input State ====
  const usernameValid =
    newUsername &&
    username !== undefined &&
    username !== newUsername &&
    !usernameError;
  const emailValid =
    newEmail &&
    userEmail !== undefined &&
    userEmail !== newEmail &&
    !emailUpdate;
  const validInput = usernameValid || emailValid;

  // Display update status
  const displayUpdateStatus = async (success: boolean) => {
    setUpdateSuccess(success);
    await wait(2000);
    setUpdateSuccess(null);
  };

  // ==== Profile Update ====
  const updateProfile = async () => {
    if (!userId || !validInput) return;

    setLoading(true);

    let usernameUpdateSuccess = true;
    let emailUpdateSuccess = true;

    if (usernameValid && emailValid) {
      const profileUpdates: Promise<any>[] = [];
      profileUpdates.push(updateProfileName(userId, newUsername));
      profileUpdates.push(updateEmail(newEmail));

      const updateResults = await Promise.allSettled(profileUpdates);
      updateResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (result.value?.error) {
            if (index === 0) usernameUpdateSuccess = false;
            else if (index === 1) emailUpdateSuccess = false;
          }
        } else {
          if (index === 0) usernameUpdateSuccess = false;
          else if (index === 1) emailUpdateSuccess = false;
        }
      });
    } else if (usernameValid) {
      try {
        await updateProfileName(userId, newUsername);
      } catch (e) {
        usernameUpdateSuccess = false;
      }
    } else if (emailValid) {
      try {
        await updateEmail(newEmail);
      } catch (e) {
        emailUpdateSuccess = false;
      }
    }

    setLoading(false);
    displayUpdateStatus(usernameUpdateSuccess && emailUpdateSuccess);

    if (!usernameUpdateSuccess && !emailUpdateSuccess)
      setUpdateAlert({
        message: "Couldn't update profile information",
        type: 'error'
      });
    else if (!usernameUpdateSuccess)
      setUpdateAlert({ message: "Couldn't update username", type: 'error' });
    else if (!emailUpdateSuccess)
      setUpdateAlert({
        message: "Couldn't update email address",
        type: 'error'
      });

    if (usernameUpdateSuccess && usernameValid) {
      setUsername(newUsername);
    }
    if (emailUpdateSuccess && emailValid) {
      setEmailUpdate({
        message: 'Confirmation email sent to new email address',
        error: false
      });
      await wait(4000);
      setEmailUpdate(null);
    }
  };

  // ==== Styling ====
  const InputClasses = classNames(
    'w-full h-13 px-3.5 border-0 text-base',
    'outline-none transition-all duration-300 placeholder:text-neutral4/50',
    'focus:bg-transparent overflow-hidden rounded-lg',
    'pl-[3.125rem] font-semibold focus:ring-0 focus:outline-0',
    'border-2'
  );
  const NameInputActive =
    newUsername &&
    newUsername.length > 0 &&
    username !== undefined &&
    username !== newUsername;
  const NameInputClasses = classNames(
    NameInputActive
      ? 'bg-transparent text-neutral7 dark:text-neutral3'
      : 'bg-neutral2 dark:bg-neutral6 text-neutral4/50',
    usernameError
      ? 'border-red-500 focus:border-red-500'
      : 'border-neutral2 dark:border-neutral6 focus:border-transparent'
  );
  const EmailInputActive =
    newEmail &&
    newEmail.length > 0 &&
    userEmail !== undefined &&
    userEmail !== newEmail;
  const EmailInputClasses = classNames(
    EmailInputActive
      ? 'bg-transparent text-neutral7 dark:text-neutral3'
      : 'bg-neutral2 dark:bg-neutral6 text-neutral4/50',
    emailUpdate && emailUpdate.error
      ? 'border-red-500 focus:border-red-500'
      : 'border-neutral2 dark:border-neutral6 focus:border-transparent'
  );

  return (
    <div className="w-full min-h-full h-full flex flex-col">
      <h1 className="text-3xl mb-8 md:mb-6 font-semibold text-neutral7 dark:text-neutral1">
        Edit profile
      </h1>
      <div
      // Input field for updating user email
      >
        <p className="font-semibold mb-2 text-sm text-neutral7 dark:text-neutral1">
          Name
        </p>
        <div
          className={classNames(
            'border rounded-xl relative mb-2',
            'border-neutral2 dark:border-neutral6'
          )}
        >
          <input
            type="text"
            className={classNames(InputClasses, NameInputClasses)}
            placeholder={'New username'}
            value={newUsername}
            onChange={onNewUsernameChange}
          />
          <svg
            className={classNames(
              'inline-block w-6 h-6 absolute top-2.5 left-3.5',
              'pointer-events-none transition-colors duration-300',
              NameInputActive ? 'fill-neutral4' : 'fill-neutral4/50'
            )}
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M2.264 19.81c2.506-2.658 5.933-4.314 9.728-4.314s7.222 1.656 9.728 4.314a1 1 0 0 1-.728 1.686h-18a1 1 0 0 1-.728-1.686zM6.492 7.996a5.5 5.5 0 1 1 11 0 5.5 5.5 0 1 1-11 0z"></path>
          </svg>
        </div>
        <AnimatePresence>
          {usernameError && (
            <motion.p
              className="text-red-500 text-sm mt-1 flex-row items-center"
              initial={{ opacity: 0, display: 'none' }}
              animate={{ opacity: 1, display: 'flex' }}
              exit={{ opacity: 0, display: 'none' }}
              key={'UsernameError'}
            >
              <ExclamationCircleIcon className={'inline-block mx-1 w-5 h-5'} />
              {usernameError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div
        // Input field for updating email
        className={'mt-6'}
      >
        <p className="font-semibold mb-2 text-sm text-neutral7 dark:text-neutral1">
          Email
        </p>
        <div
          className={classNames(
            'border rounded-xl relative mb-2',
            'border-neutral2 dark:border-neutral6'
          )}
        >
          <input
            type="email"
            className={classNames(InputClasses, EmailInputClasses)}
            value={newEmail}
            placeholder={'New email'}
            onChange={onNewEmailChange}
          />
          <EnvelopeIcon
            className={classNames(
              'inline-block w-6 h-6 absolute top-2.5 left-3.5',
              'pointer-events-none transition-colors duration-300',
              EmailInputActive ? 'fill-neutral4' : 'fill-neutral4/50'
            )}
          />
        </div>
        <AnimatePresence>
          {emailUpdate && (
            <motion.p
              className={classNames(
                'text-sm mt-1',
                emailUpdate.error ? 'text-red-500' : 'text-teal-400'
              )}
              initial={{ opacity: 0, display: 'none' }}
              animate={{ opacity: 1, display: 'flex' }}
              exit={{ opacity: 0, display: 'none' }}
              key={'EmailError'}
            >
              {emailUpdate.error && (
                <ExclamationCircleIcon
                  className={'inline-block mx-1 w-5 h-5'}
                />
              )}
              {emailUpdate.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <button
        className={classNames(
          'mt-7 w-full bg-teal-400 text-white font-bold',
          validInput && 'hover:bg-teal-400/90 active:bg-teal-400/90',
          'text-sm px-6 py-2.5 rounded-xl outline-none focus:outline-none mr-1 mb-1',
          'transition-all duration-300 ease-in flex items-center justify-center',
          'disabled:cursor-not-allowed',
          !validInput && 'opacity-75'
        )}
        type="button"
        style={{ transition: 'all .15s ease' }}
        onClick={updateProfile}
        disabled={loading || !validInput}
      >
        {loading ? (
          <RotatingLines
            strokeColor="white"
            strokeWidth="2"
            animationDuration="1"
            width="1.5rem"
            visible={true}
          />
        ) : updateSuccess !== null ? (
          updateSuccess ? (
            <CheckIcon className={'w-[1.5rem] h-[1.5rem] stroke-white'} />
          ) : (
            <XMarkIcon className={'w-[1.5rem] h-[1.5rem] stroke-white'} />
          )
        ) : (
          <p className={'inline-block py-0.5'}>Save changes</p>
        )}
      </button>
    </div>
  );
};
export default ProfileTab;
