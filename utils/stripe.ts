import Stripe from 'stripe';
import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js';

const inDevEnv = process.env.NODE_ENV === 'development';
const stripeSecretKey =
  (inDevEnv
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY_LIVE) ?? '';
const stripePublishableKey =
  (inDevEnv
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE) ?? '';
let stripePromise: Promise<StripeClient | null>;

export const stripe = new Stripe(stripeSecretKey, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-11-15',
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: 'BrainBot'
  }
});

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export default stripe;
