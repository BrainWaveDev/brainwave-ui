import { useState, memo } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';

type SubscriptionPlan = 'Free' | 'Pro';

const Subscription = memo(() => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>('Free');

  const handleSubscriptionChange = (plan: SubscriptionPlan) => {
    setCurrentPlan(plan);
    // TODO: Implement actual subscription change logic here
  };

  return (
    <div className="w-full h-full">
      <h1 className="mb-8 text-3xl md:mb-6 font-semibold text-neutral7 dark:text-neutral1">
        Subscription
      </h1>
      <div className={'max-w-full'}>
        <div className="text-neutral7 dark:text-white font-medium text-base">
          Choose your plan
        </div>
        <div className={'max-w-full overflow-x-scroll overflow-y-clip pb-3'}>
          <div
            className={classNames(
              'flex flex-row justify-center items-center mt-3 w-full',
              'h-auto md:pt-0 md:w-[90%] md:h-[320px] min-w-[25rem]'
            )}
          >
            <div
              // Basic plan card
              className={classNames(
                'bg-neutral2 dark:bg-neutral1',
                'w-1/2 h-full rounded-l-2xl',
                'transition-all duration-300'
              )}
            >
              <h2 className="text-center font-semibold text-3xl mt-4">Free</h2>
              <p className="text-center font-normal text-base mt-4">
                Basic chat features
              </p>
              <div className="my-4 text-center">
                <span className="mr-2 text-3xl">$0</span>
                <span className="h4 text-sm text-slate-400">/mo</span>
              </div>
              <div className="flex align-middle justify-center pt-3">
                <div className="">
                  <div className="flex mt-1">
                    <div className="w-[20px] h-[20px]">
                      <CheckCircleIcon className="object-fill fill-neutral4" />
                    </div>
                    <p className="ml-1 text-xs leading-5">Unlimited Messages</p>
                  </div>
                  <div className="flex mt-1">
                    <div className="w-[20px] h-[20px]">
                      <CheckCircleIcon className="object-fill fill-neutral4" />
                    </div>
                    <p className="ml-1 text-xs leading-5">Unlimited Messages</p>
                  </div>
                  <div className="flex mt-1">
                    <div className="w-[20px] h-[20px]">
                      <CheckCircleIcon className="object-fill fill-neutral4" />
                    </div>
                    <p className="ml-1 text-xs leading-5">Unlimited Messages</p>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center align-middle my-5">
                <button
                  className={classNames(
                    'rounded-full border-2 border-zinc-300 hover:bg-zinc-300 active:bg-zinc-300',
                    'w-full mx-3 text-white disabled:opacity-50 disabled:cursor-not-allowed',
                    'disabled:bg-zinc-300',
                    'transition-all duration-300'
                  )}
                  disabled={currentPlan === 'Free'}
                  onClick={() => handleSubscriptionChange('Free')}
                >
                  <div className="flex justify-center align-middle text-neutral7">
                    {currentPlan === 'Free' ? (
                      <p className="text-sm font-semibold py-2">Current plan</p>
                    ) : (
                      <p className="text-sm font-semibold py-2">Downgrade</p>
                    )}
                  </div>
                </button>
              </div>
            </div>
            <div
              // Pro plan card
              className={classNames(
                'bg-neutral7 dark:bg-neutral6 rounded-r-2xl',
                'w-1/2 h-full transition-all duration-300'
              )}
            >
              <h2
                className="text-center font-bold text-3xl mt-4 text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'var(--text-gradient)'
                }}
              >
                Pro
              </h2>
              <p className="text-white text-center font-normal text-base mt-4">
                Unlimited Storage
              </p>
              <div className="my-4 text-center">
                <span className="text-white mr-2 text-3xl">$5</span>
                <span className="h4 text-sm text-neutral4">/mo</span>
              </div>
              <div className="flex align-middle justify-center pt-3.5">
                <div className="text-white">
                  <div className="flex mt-1">
                    <div className="w-[20px] h-[20px]">
                      <CheckCircleIcon className="object-fill fill-neutral3" />
                    </div>
                    <p className="ml-1 text-xs text-neutral3 leading-5">
                      Unlimited Storage
                    </p>
                  </div>
                  <div className="flex mt-1">
                    <div className="w-[20px] h-[20px]">
                      <CheckCircleIcon className="object-fill" />
                    </div>
                    <p className="ml-1 text-xs leading-5">Unlimited Storage</p>
                  </div>
                  <div className="flex mt-1">
                    <div className="w-[20px] h-[20px]">
                      <CheckCircleIcon className="object-fill" />
                    </div>
                    <p className="ml-1 text-xs leading-5">Unlimited Storage</p>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center align-middle my-5">
                <button
                  className={classNames(
                    'rounded-full w-full mx-3 text-white group',
                    'transition-all duration-300',
                    'flex items-center justify-center align-middle p-[2px]',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                  style={{
                    backgroundImage: 'var(--text-gradient)'
                  }}
                  disabled={currentPlan === 'Pro'}
                  onClick={() => handleSubscriptionChange('Pro')}
                >
                  <div
                    className={classNames(
                      'bg-neutral7 dark:bg-neutral6 flex justify-center align-middle',
                      'mx-[1px] my-[2px] h-full w-full rounded-full',
                      'group-hover:bg-transparent group-active:bg-transparent',
                      'transition-colors duration-300 group-disabled:bg-transparent'
                    )}
                  >
                    <p className="text-sm font-semibold pb-1 pt-1.5">
                      {currentPlan === 'Pro' ? 'Current plan' : 'Upgrade'}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className={classNames(
          'mt-5 w-full md:w-[90%] bg-transparent text-teal-400/60 font-bold',
          'hover:text-teal-400 active:text-teal-400',
          'text-base px-6 py-3 rounded-xl outline-none focus:outline-none sm:ml-3 mb-1',
          'transition-all duration-300 ease-in flex items-center justify-center',
          'cursor-pointer'
        )}
        // TODO: Add link to Stripe
      >
        <p className={'inline whitespace-pre-line'}>
          Manage subscription in{' '}
          <span className={'whitespace-nowrap'}>
            Stripe
            <ArrowLongRightIcon className="w-6 h-6 ml-1.5 inline" />
          </span>
        </p>
      </button>
    </div>
  );
});

export default Subscription;
