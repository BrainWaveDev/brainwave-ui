import Stripe from 'stripe';

const inDevEnv = process.env.NODE_ENV === 'development';
const stripeApiKey =
  (inDevEnv
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY_LIVE) ?? '';
export const stripe = new Stripe(stripeApiKey, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-11-15',
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: 'BrainBot'
  }
});

export default stripe;
