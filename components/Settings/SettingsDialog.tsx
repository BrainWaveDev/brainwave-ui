import { useCallback, useEffect, useState, Fragment, memo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { getProfile, updateProfileName } from '@/utils/app/userSettings';
import { useUser } from '@supabase/auth-helpers-react';
import classNames from 'classnames';
import ProfileTab from '@/components/Settings/ProfileTab';
import TriangleIcon from '@/components/icons/TraingleIcon';
// @ts-ignore
import { motion, AnimatePresence } from 'framer-motion';
import TabSwitcher from '@/components/Settings/TabSwitcher';
import PasswordTab from '@/components/Settings/PasswordTab';
import SubscriptionTab from '@/components/Settings/SubscriptionTab';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export type Tabs = 'profile' | 'password' | 'subscription';

export type UpdateAlert = {
  message: string;
  type: 'error' | 'success';
};

const SettingsDialog = memo(
  ({
    settingDialogOpen,
    closeSettingDialog
  }: {
    settingDialogOpen: boolean;
    closeSettingDialog: () => void;
  }) => {
    // ==== Local State ====
    const [currentTab, setCurrentTab] = useState<Tabs>('profile');
    const [updateAlert, setUpdateAlert] = useState<UpdateAlert | null>(null);
    const onChangeUpdateAlert = useCallback(
      (message: UpdateAlert | null) => setUpdateAlert(message),
      [setUpdateAlert]
    );

    // ==== User Information ====
    const user = useUser();
    const [username, setUsername] = useState<string>('');
    useEffect(() => {
      if (user) {
        getProfile(user.id)
          .then((profile) =>
            setUsername(profile.user_name ? profile.user_name : '')
          )
          .catch(() =>
            setUpdateAlert({
              message: "Couldn't fetch profile information",
              type: 'error'
            })
          );
      }
    }, [user]);

    // ==== Page Refresh ====
    const router = useRouter();

    // ==== Profile Update ====
    const onUpdateProfile = useCallback(
      async (newUsername: string) => {
        if (user) {
          try {
            await updateProfileName(user.id, newUsername);
            setUsername(newUsername);
          } catch (e) {
            setUpdateAlert({
              message: "Couldn't update profile",
              type: 'error'
            });
          }
        } else {
          setUpdateAlert({
            message: "Couldn't get profile information",
            type: 'error'
          });
        }
      },
      [user, router, setUpdateAlert]
    );

    return (
      <Transition show={settingDialogOpen} as={Fragment}>
        <Dialog
          onClose={closeSettingDialog}
          className="fixed z-40 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen text-black">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-neutral7/75 dark:bg-neutral6/80" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  'relative z-10 w-screen h-screen max-w-screen lg:max-w-[48rem] md:py-6 flex items-center justify-center'
                )}
              >
                <div
                  className={classNames(
                    'flex md:block bg-white w-full max -w-full md:max-w-[48rem]',
                    'min-h-full md:min-h-[44rem] md:h-fit md:rounded-[1.5rem] p-12',
                    'lg:px-8 md:px-5 md:pb-8 relative',
                    'bg-neutral1 dark:bg-neutral7'
                  )}
                >
                  <div
                    className={classNames(
                      'flex flex-grow flex-col px-1 mx-auto md:mx-0 md:grid',
                      'md:grid-cols-3 max-w-full sm:max-w-[35rem] md:min-w-full'
                    )}
                  >
                    <TabSwitcher
                      currentTab={currentTab}
                      setCurrentTab={setCurrentTab}
                    />
                    <div className="px-1 md:px-0 md:col-span-2">
                      {currentTab === 'profile' && (
                        <ProfileTab
                          username={username}
                          setUsername={setUsername}
                          userEmail={user?.email}
                          userId={user?.id}
                          updateUsername={onUpdateProfile}
                          setUpdateAlert={onChangeUpdateAlert}
                        />
                      )}
                      {currentTab === 'password' && (
                        <PasswordTab
                          userEmail={user?.email}
                          setUpdateAlert={onChangeUpdateAlert}
                        />
                      )}
                      {currentTab === 'subscription' && <SubscriptionTab />}
                    </div>
                  </div>
                  <AnimatePresence>
                    {updateAlert && (
                      <motion.div
                        // Error updateAlert displayed at the bottom of the dialog
                        className={classNames(
                          'left-0 right-0 flex items-center justify-center',
                          'absolute bottom-4'
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex items-center justify-center gap-x-1.5 -ml-6">
                          {updateAlert.type === 'error' && (
                            <TriangleIcon
                              className={'w-6 h-6 mt-0.5 stroke-red-500'}
                              strokeWidth={1.5}
                            />
                          )}
                          <span
                            className={classNames(
                              'font-semibold',
                              updateAlert.type === 'success'
                                ? 'text-teal-400'
                                : 'text-red-500'
                            )}
                          >
                            {updateAlert.message}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    // Dialog close button
                    className={classNames(
                      'absolute top-5 right-6 rounded-full group'
                    )}
                    onClick={closeSettingDialog}
                  >
                    <XMarkIcon
                      className={classNames(
                        'w-6 h-6 stroke-neutral7/50',
                        'dark:stroke-neutral4 transition-colors duration-300',
                        'group-hover:stroke-teal-300 group-active:stroke-teal-300'
                      )}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  }
);

export default SettingsDialog;
