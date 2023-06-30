import { memo, useState } from 'react';
import classNames from 'classnames';

const ProfileTab = memo(
  ({
    username,
    updateUsername
  }: {
    username: string;
    updateUsername: (newUsername: string) => void;
  }) => {
    // ==== Local State ====
    const [profileName, setProfileName] = useState<string>(username);

    // ==== Styling ====
    const NameInputClasses = classNames(
      'w-full h-13 px-3.5 border-0 text-base',
      'text-neutral7 outline-none transition-all duration-300 placeholder:text-neutral4/50',
      profileName.length > 0
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
                profileName.length > 0 ? 'fill-neutral4' : 'fill-neutral4/50'
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
            'text-sm px-6 py-3 rounded-xl outline-none focus:outline-none mr-1 mb-1',
            'transition-all duration-300 ease-in'
          )}
          type="button"
          style={{ transition: 'all .15s ease' }}
          onClick={() => updateUsername(profileName)}
        >
          Save changes
        </button>
      </div>
    );
  }
);

export default ProfileTab;
