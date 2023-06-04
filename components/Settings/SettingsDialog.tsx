import { Dispatch, SetStateAction, useEffect, useCallback, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { ArrowRightIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from 'context/redux/store'
import { toggleSettingDialog } from 'context/redux/sidebarSlice'
import { getProfile, signoutUser, updatePassword, updateProfileName, validatePassword } from '@/utils/app/userSettings'
import Link from 'next/link'
import { useUser } from '@supabase/auth-helpers-react'


type Tabs = 'profile' | 'password'

export default function SettingsDialog() {
  const [currentTab, setCurrentTab] = useState<Tabs>('profile')
  const { settingDialogOpen } = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  return (
    <Dialog open={settingDialogOpen} onClose={() => {
      dispatch(toggleSettingDialog())
    }}
      className="fixed z-20 inset-0 overflow-y-auto "
    >
      <div className="flex items-center justify-center min-h-screen text-black">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Panel className="relative z-10 w-full m-auto bg-n-1 rounded-3xl dark:bg-n-7 undefined max-w-[48rem] md:min-h-screen-ios md:rounded-none opacity-100 scale-100">
          <div className="flex md:block bg-white w-[720px] h-[712px] rounded-lg p-12 lg:px-8 md:px-5 md:pb-8">
            <div className="grid grid-cols-3 min-w-full min-h-full">
              {SideOptions(setCurrentTab)}
              <div className="col-span-2 ">
                {
                  (currentTab === 'profile') && <Profile />
                }
                {
                  (currentTab === 'password') && <Password />
                }
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

function Profile() {
  const [profileName, setProfileName] = useState<string>('')
  const user = useUser()

  useEffect(() => {
    if (user) {
      getProfile(user.id)
        .then(profile => setProfileName(profile.user_name ? profile.user_name : ''))
        .catch(error => console.error(error))
    }
  }, [user])

  const onUpdateProfile = async () => {
    if (user) {
      updateProfileName(user.id, profileName)
        .then(() => {
          window.location.reload();
        })
        .catch(error => console.error(error))
    }
  }

  return (
    <div className='w-full h-full'>
      <h1 className='mb-8 text-4xl md:mb-6 font-semibold'>Profile</h1>
      <div className=''>
        <div className='font-medium mb-1 text-lg'>
          User Name
        </div>
        <div className='border-2 border-n-2 rounded-xl relative '>
          <input
            type="text"
            className='w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent pl-[3.125rem] false undefined'
            placeholder={'Enter Your New User Name'}
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
          <UserIcon className='inline-block h-[30px] left-2 top-1.5 opacity-50 absolute fill-n-4/50 pointer-events-none transition-colors false' />
        </div>

        <button
          className='mt-4 ml-1 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1'
          type="button"
          style={{ transition: "all .15s ease" }}
          onClick={onUpdateProfile}
        >
          Update User Name
        </button>

      </div>
      <div className='font-medium mt-10 mb-2 text-lg rounded-3xl border-spacing-3 border-4 border-blackA10 inline-flex relative px-4 hover:border-blue-600'>
        <Link
          href={'/subscription'}
        >
          Go To Subscription
        </Link>
        <div className='flex flex-col justify-center align-middle h-[28px] ml-[5px] '>
          <ArrowRightIcon
            className='w-6 h-6'
          />
        </div>
      </div>
    </div>
  )
}

function Password() {

  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')
  const [passwordnotMatch, setPasswordnotMatch] = useState<boolean>(false)

  const user = useUser()
  const dispatch = useAppDispatch()

  const onUpdatePassword = async () => {
    if (!user) {
      console.error('User not logged in')
      return
    }

    if (!user?.email) {
      console.error('User email not found, not a email user')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordnotMatch(true)
      return
    } else {
      setPasswordnotMatch(false)
    }

    try {
      await validatePassword(user.email, currentPassword)
      await updatePassword(newPassword)
      await signoutUser()
      dispatch(toggleSettingDialog())
      window.location.reload();
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='w-full h-full'>
      <h1 className='mb-8 text-4xl md:mb-6 font-semibold'>Password</h1>
      <div className=''>
        <div className='font-medium mb-2 text-lg'>
          Current Password
        </div>

        <div className='border-2 border-n-2 rounded-xl relative '>
          <input
            type="password"
            className='w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent pl-[3.125rem] false undefined'
            placeholder={'Enter Your Current Password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <LockClosedIcon className='inline-block h-[66%] left-2 top-1.5 opacity-50 absolute fill-n-4/50 pointer-events-none transition-colors false' />
        </div>

        <div className='font-medium mt-5 mb-2 text-lg'>
          New Password
        </div>

        <div className='border-2 border-n-2 rounded-xl relative '>
          <input
            type="password"
            className='w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent pl-[3.125rem] false undefined'
            placeholder={'Enter Your New Password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <LockClosedIcon className='inline-block h-[66%] left-2 top-1.5 opacity-50 absolute fill-n-4/50 pointer-events-none transition-colors false' />
        </div>

        <div className='font-medium mt-5 mb-2 text-lg'>
          Confirm New Password
        </div>


        <div className='border-2 border-n-2 rounded-xl relative '>

          <input
            type="password"
            className={`w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors 
            placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent pl-[3.125rem] false undefined
            ${passwordnotMatch ? 'border-red-500' : ''}`}
            placeholder={'Confirm Your New Password'}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />

          <LockClosedIcon className='inline-block h-[66%] left-2 top-1.5 opacity-50 absolute fill-n-4/50 pointer-events-none transition-colors false' />
        </div>
        {
          passwordnotMatch && <p className='text-red-500 text-sm mt-1'>Password not match</p>
        }

        <button
          className='mt-8 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1'
          type="button"
          style={{ transition: "all .15s ease" }}
          onClick={onUpdatePassword}
        >
          Update Password
        </button>
      </div>
    </div>
  )
}



function SideOptions(setCurrentTab: Dispatch<SetStateAction<Tabs>>) {
  return (
    <div className="col-span-1 flex flex-col mr-5">
      <button
        className='group flex items-center w-full px-3.5 py-1.5 rounded-full border-2 border-transparent base2 font-semibold transition-colors hover:bg-blue-200'
        onClick={() => setCurrentTab('profile')}
      >
        <div className='w-8 h-8 '>
          <UserCircleIcon className='object-fill' />
        </div>
        <h3
          className='ml-3.5 text-base font-semibold text-n-7 dark:text-n-1'
        >
          Profile
        </h3>
      </button>

      <button
        className='group flex items-center w-full px-3.5 py-1.5 rounded-full border-2 border-transparent base2 font-semibold transition-colors hover:bg-blue-200'
        onClick={() => setCurrentTab('password')}
      >
        <div className='w-8 h-8 '>
          <LockClosedIcon className='object-fill' />
        </div>
        <h3
          className='ml-3.5 text-base font-semibold text-n-7 dark:text-n-1'
        >
          Password
        </h3>
      </button>
    </div>
  )
}
