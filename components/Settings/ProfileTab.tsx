import React, { memo, useCallback, useState } from 'react';
import classNames from 'classnames';
import { updateProfileName } from '@/utils/app/userSettings';
import { RotatingLines } from 'react-loader-spinner';
import { wait } from '@/utils/helpers';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProfileTab = memo(
  ({
    username,
    userId,
    setError
  }: {
    username?: string;
    userId?: string;
    updateUsername: (newUsername: string) => void;
    setError: (errorMessage: string) => void;
  }) => {
    // ==== Local State ====
    const [profileName, setProfileName] = useState<string | undefined>(
      username
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);

    // Display update status
    const displayUpdateStatus = async (success: boolean) => {
      setUpdateSuccess(success);
      await wait(2000);
      setUpdateSuccess(null);
    };

    // ==== Profile Update ====
    const updateUsername = useCallback(
      async (newUsername: string) => {
        if (!userId) return;

        try {
          setLoading(true);
          await updateProfileName(userId, newUsername);
          setLoading(false);
          await displayUpdateStatus(true);
        } catch (e) {
          setError("Couldn't update profile");
          setLoading(false);
          await displayUpdateStatus(false);
        }
      },
      [userId, setError]
    );

    // ==== Styling ====
    const NameInputClasses = classNames(
      'w-full h-13 px-3.5 border-0 text-base',
      'text-neutral7 outline-none transition-all duration-300 placeholder:text-neutral4/50',
      profileName && profileName.length > 0
        ? 'bg-transparent'
        : 'bg-neutral2 dark:bg-neutral6',
      'focus:bg-transparent dark:text-neutral3 overflow-hidden rounded-lg',
      'pl-[3.125rem] font-semibold focus:ring-0 focus:outline-0',
      'border-2 border-neutral2 dark:border-neutral6 focus:border-transparent'
    );

    return (
      <div className="w-full min-h-full h-full flex flex-col">
        <h1 className="text-3xl mb-8 md:mb-6 font-semibold text-neutral7 dark:text-neutral1">
          Edit profile
        </h1>
        <div className="flex-grow">
          <p className="font-semibold mb-2 text-base text-neutral7 dark:text-neutral1">
            Name
          </p>
          <div className="border border-neutral2 dark:border-neutral6 rounded-xl relative">
            <input
              type="text"
              className={NameInputClasses}
              placeholder={'Username'}
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
            <svg
              className={classNames(
                'inline-block w-6 h-6 absolute top-2.5 left-3.5',
                'pointer-events-none transition-colors duration-300',
                profileName && profileName.length > 0
                  ? 'fill-neutral4'
                  : 'fill-neutral4/50'
              )}
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M2.264 19.81c2.506-2.658 5.933-4.314 9.728-4.314s7.222 1.656 9.728 4.314a1 1 0 0 1-.728 1.686h-18a1 1 0 0 1-.728-1.686zM6.492 7.996a5.5 5.5 0 1 1 11 0 5.5 5.5 0 1 1-11 0z"></path>
            </svg>
          </div>
        </div>
        <button
          className={classNames(
            'mt-5 w-full bg-teal-400 text-white font-bold',
            'hover:bg-teal-400/90 active:bg-teal-400/90',
            'text-sm px-6 py-2.5 rounded-xl outline-none focus:outline-none mr-1 mb-1',
            'transition-all duration-300 ease-in flex items-center justify-center'
          )}
          type="button"
          style={{ transition: 'all .15s ease' }}
          onClick={() => updateUsername(profileName!)}
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
  }
);

export default ProfileTab;
