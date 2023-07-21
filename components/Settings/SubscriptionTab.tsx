import React, { Dispatch, memo, SetStateAction } from 'react';
import { CheckCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { ProductWithPrice } from '@/types/products';
import { getSubscriptionStateFromStorage } from '../../context/redux/subscriptionSlice';
import { createPortalLink, postSubscriptionUpdate } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe';
import { UpdateAlert } from '@/components/Settings/SettingsDialog';
import { useAppDispatch } from 'context/redux/store';
import { optimisticErrorActions } from '../../context/redux/errorSlice';
import { AnimatePresence, motion } from 'framer-motion';
import CheckBadgeIconFilled from '@/components/icons/CheckBadgeIconFilled';
import { useRouter } from 'next/router';

// TODO: Define fallback information for the Advanced Plan

const Subscription = memo(
  ({
    setUpdateAlert,
    loading,
    setLoading
  }: {
    setUpdateAlert: (message: UpdateAlert | null) => void;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
  }) => {
    // ====== Router ======
    const router = useRouter();

    // ====== Redux Store ======
    const dispatch = useAppDispatch();
    const { products, subscription: userSubscription } =
      getSubscriptionStateFromStorage();

    // ===== Find information about the Advanced Plan =====
    const advancedPlan = products.find(
      (product) => product.name === 'Advanced Plan'
    );
    if (!advancedPlan)
      setUpdateAlert({
        message: "Couldn't fetch user information",
        type: 'error'
      });

    // ====== Extract information about the current subscription plan ======
    const subscriptionEndsAtBillingPeriod =
      userSubscription?.cancel_at_period_end;
    const customerIsOnAdvancedPlan =
      userSubscription?.prices?.products?.name === 'Advanced Plan' &&
      userSubscription?.status === 'active';
    const currentPeriodEnd = userSubscription?.current_period_end
      ? new Date(userSubscription?.current_period_end)
      : undefined;

    // ===== Determine the subscription status message =====
    let subscriptionStatusMessage: JSX.Element | undefined = undefined;
    if (customerIsOnAdvancedPlan || subscriptionEndsAtBillingPeriod) {
      const date = currentPeriodEnd?.toDateString().split(' ');
      const day = `${date?.[1]} ${date?.[2]}`;
      const year = date?.[3];
      const formattedDate = `${day}, ${year}`;
      if (subscriptionEndsAtBillingPeriod) {
        subscriptionStatusMessage = (
          <>
            Advanced Subscription Expires on <strong>{formattedDate}</strong>
          </>
        );
      } else {
        subscriptionStatusMessage = (
          <>
            Advanced Subscription Renews on <strong>{formattedDate}</strong>
          </>
        );
      }
    }

    // ====== Handle subscription change ======
    const handleSubscriptionChange = async (
      product: ProductWithPrice | null,
      subscriptionEndsAtBillingPeriod: boolean = false
    ) => {
      // TODO: Display loading animation
      try {
        setLoading(true);
        // Redirecting to a checkout page for paid subscriptions
        if (product) {
          if (!product.monthlyPrice) throw Error('Internal error');
          if (customerIsOnAdvancedPlan) throw Error('Internal error');

          const data = await postSubscriptionUpdate({
            url: '/api/create-checkout-session',
            data: {
              price: product.monthlyPrice
            },
            requestType: 'create'
          });

          // Don't make a checkout page if we are reactivating a subscription
          if (subscriptionEndsAtBillingPeriod) {
            // We should receive updated subscription data
            if (!data.subscription)
              throw Error("Couldn't reactive subscription");
          } else {
            const stripe = await getStripe();
            const sessionId = data.sessionId as any;
            stripe?.redirectToCheckout({ sessionId });
          }
        }
        // Switching to free plan
        else {
          if (!customerIsOnAdvancedPlan) throw Error('Internal error');
          if (!userSubscription || !userSubscription.id)
            throw Error('Internal error');

          // Cancel current subscription
          const { subscription } = await postSubscriptionUpdate({
            url: '/api/create-checkout-session',
            data: {
              subscriptionId: userSubscription.id
            },
            requestType: 'cancel'
          });
          if (!subscription) throw Error("Couldn't update subscription");
        }
      } catch (error: any) {
        dispatch(optimisticErrorActions.addErrorWithTimeout(error.message));
      } finally {
        setLoading(false);
      }
    };

    // ======= Redirect user to the user's portal =======
    const redirectToCustomerPortal = async () => {
      setLoading(true);
      try {
        const { url, error } = await createPortalLink({
          url: '/api/create-portal-link'
        });
        if (error) throw Error(error.message);
        else router.push(url);
      } catch (error) {
        dispatch(
          optimisticErrorActions.addErrorWithTimeout((error as Error).message)
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="w-full h-full">
        <h1 className="mb-8 text-3xl md:mb-6 font-semibold text-neutral7 dark:text-neutral1">
          Subscription
        </h1>
        <div className={'max-w-full flex flex-col'}>
          <div className="text-neutral7 dark:text-white font-medium text-base self-start">
            Choose your plan
          </div>
          <div className={'max-w-full overflow-x-scroll overflow-y-clip pb-3'}>
            <div
              className={classNames(
                'flex flex-row justify-center items-center mt-3 w-full min-w-fit',
                'h-auto md:pt-0 md:w-[90%] md:h-[320px] min-w-[25rem]'
              )}
            >
              <div
                // Free Plan card
                className={classNames(
                  'bg-neutral2 dark:bg-neutral1',
                  'w-1/2 h-full rounded-l-2xl',
                  'transition-all duration-300',
                  'min-w-[13.75rem]'
                )}
              >
                <h2
                  className={classNames(
                    'text-center font-semibold text-3xl mt-4 ml-6',
                    'flex flex-row items-center justify-center gap-x-0.5'
                  )}
                >
                  Free
                  {!customerIsOnAdvancedPlan && (
                    <CheckBadgeIcon
                      className={'h-6 w-6 stroke-[1.5] fill-black -mt-2'}
                    />
                  )}
                </h2>
                <p className="text-center font-normal text-base mt-4">
                  Basic chat features
                </p>
                <div className="my-4 text-center">
                  <span className="mr-2 text-3xl">$0</span>
                  <span className="h4 text-sm text-slate-400">/mo</span>
                </div>
                <div className="flex align-middle justify-center pt-3.5">
                  <div className="">
                    <div className="flex mt-1">
                      <div className="w-[20px] h-[20px]">
                        <CheckCircleIcon className="object-fill fill-neutral4" />
                      </div>
                      <p className="ml-1 text-xs leading-5">
                        Unlimited Messages
                      </p>
                    </div>
                    <div className="flex mt-1">
                      <div className="w-[20px] h-[20px]">
                        <CheckCircleIcon className="object-fill fill-neutral4" />
                      </div>
                      <p className="ml-1 text-xs leading-5">
                        Unlimited Messages
                      </p>
                    </div>
                    <div className="flex mt-1">
                      <div className="w-[20px] h-[20px]">
                        <CheckCircleIcon className="object-fill fill-neutral4" />
                      </div>
                      <p className="ml-1 text-xs leading-5">
                        Unlimited Messages
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-center align-middle my-5">
                  <button
                    className={classNames(
                      'rounded-full hover:bg-zinc-300 active:bg-zinc-300',
                      'w-full mx-3 text-white group h-full',
                      'disabled:bg-zinc-300 p-[2px]',
                      !customerIsOnAdvancedPlan &&
                        subscriptionEndsAtBillingPeriod &&
                        '!opacity-0',
                      'transition-all duration-300',
                      'disabled:opacity-75 disabled:cursor-not-allowed',
                      loading && 'pointer-events-none'
                    )}
                    disabled={
                      !customerIsOnAdvancedPlan ||
                      subscriptionEndsAtBillingPeriod
                    }
                    onClick={() => handleSubscriptionChange(null)}
                  >
                    <div
                      className={classNames(
                        'flex justify-center align-middle text-neutral7',
                        'bg-neutral2 dark:bg-neutral1 rounded-full mx-[1px]',
                        'group-hover:bg-transparent group-active:bg-transparent',
                        'transition-colors duration-300 group-disabled:bg-transparent'
                      )}
                    >
                      {customerIsOnAdvancedPlan ? (
                        <div className="text-sm font-semibold py-1.5">
                          Downgrade
                        </div>
                      ) : (
                        <div
                          className={classNames(
                            'text-sm font-semibold py-1.5',
                            subscriptionEndsAtBillingPeriod && 'opacity-0'
                          )}
                        >
                          Current plan
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
              <div
                // Advanced Plan card
                className={classNames(
                  'bg-neutral7 dark:bg-neutral6 rounded-r-2xl',
                  'w-1/2 h-full transition-all duration-300 min-w-[13.75rem]'
                )}
              >
                <h2
                  className={classNames(
                    'text-center font-bold text-3xl md:text-3xl mt-4 text-transparent bg-clip-text',
                    'flex flex-row items-center justify-center gap-x-0.5 ml-6'
                  )}
                  style={{
                    backgroundImage: 'var(--text-gradient)'
                  }}
                >
                  Advanced
                  {!customerIsOnAdvancedPlan && (
                    <CheckBadgeIconFilled
                      className={'h-6 w-6 stroke-[1.5] -mt-2'}
                      fill={'url(#main-gradient)'}
                    />
                  )}
                </h2>
                <p className="text-white text-center font-normal text-base mt-4">
                  Unlimited Storage
                </p>
                <div className="my-4 text-center">
                  <span className="text-white mr-2 text-3xl">
                    {advancedPlan!.priceString}
                  </span>
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
                      <p className="ml-1 text-xs leading-5">
                        Unlimited Storage
                      </p>
                    </div>
                    <div className="flex mt-1">
                      <div className="w-[20px] h-[20px]">
                        <CheckCircleIcon className="object-fill" />
                      </div>
                      <p className="ml-1 text-xs leading-5">
                        Unlimited Storage
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-center align-middle my-5">
                  <button
                    className={classNames(
                      'rounded-full w-full mx-3 text-white group',
                      'transition-all duration-300',
                      'flex items-center justify-center align-middle p-[2px]',
                      'disabled:opacity-75 disabled:cursor-not-allowed',
                      'loading && pointer-events-none'
                    )}
                    style={{
                      backgroundImage: 'var(--text-gradient)'
                    }}
                    disabled={
                      customerIsOnAdvancedPlan &&
                      !subscriptionEndsAtBillingPeriod
                    }
                    onClick={() =>
                      handleSubscriptionChange(
                        advancedPlan!,
                        customerIsOnAdvancedPlan
                      )
                    }
                  >
                    <div
                      className={classNames(
                        'bg-neutral7 dark:bg-neutral6 flex justify-center align-middle',
                        'mx-[1px] h-full w-full rounded-full group',
                        'group-hover:bg-transparent group-active:bg-transparent',
                        'transition-colors duration-300 group-disabled:bg-transparent'
                      )}
                    >
                      <p className="text-sm font-semibold py-1.5 relative flex items-center justify-center">
                        <span
                          className={
                            'opacity-100 group-hover:opacity-0 transition-all duration-300'
                          }
                        >
                          {customerIsOnAdvancedPlan
                            ? 'Current Plan'
                            : 'Upgrade'}
                        </span>
                        <span
                          className="block absolute opacity-0 group-hover:opacity-100 transition-all duration-300"
                          aria-hidden="true"
                        >
                          Reactivate{' '}
                        </span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {subscriptionStatusMessage && (
              <motion.p
                className={classNames(
                  'text-center text-sm text-neutral7 dark:text-neutral1',
                  'mt-1 mb-0 w-[80%] md:-ml-10',
                  'whitespace-break-spaces self-center'
                )}
                initial={{ opacity: 0, display: 'none' }}
                animate={{ opacity: 1, display: 'block' }}
                exit={{ opacity: 0, display: 'none' }}
                key={'SubscriptionRenewalMessage'}
              >
                {subscriptionStatusMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <button
          className={classNames(
            'mt-0 w-full md:w-[90%] bg-transparent text-teal-400/60 font-bold',
            'hover:text-teal-400 active:text-teal-400',
            'text-base px-6 py-3 rounded-xl outline-none focus:outline-none sm:ml-3 mb-1',
            'transition-all duration-300 ease-in flex items-center justify-center',
            'cursor-pointer'
          )}
          disabled={loading}
          onClick={redirectToCustomerPortal}
        >
          <p className={'inline whitespace-pre-line'}>
            Manage subscription on{' '}
            <span className={'whitespace-nowrap'}>
              Stripe
              <ArrowLongRightIcon className="w-6 h-6 ml-1.5 inline" />
            </span>
          </p>
        </button>
      </div>
    );
  }
);

export default Subscription;
