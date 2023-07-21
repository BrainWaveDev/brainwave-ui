import { NextApiHandler } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '@/utils/stripe';
import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
import { getURL } from '@/utils/helpers';
import {
  CreateSubscriptionRequest,
  CancelSubscriptionRequest
} from '@/types/products';

const CreateCheckoutSession: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const requestType = req.headers['type'];

    if (
      !requestType ||
      (requestType !== 'create' && requestType !== 'cancel')
    ) {
      console.error('Invalid request');
      return res
        .status(400)
        .json({ error: { statusCode: 400, message: 'Invalid request' } });
    }
    try {
      // Get information about the user
      const supabase = createPagesServerClient({ req, res });
      const {
        data: { user }
      } = await supabase.auth.getUser();
      const customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });

      if (requestType === 'create') {
        const {
          price,
          quantity = 1,
          metadata = {}
        } = req.body as CreateSubscriptionRequest;

        // Return information about whether the checkout was successful in the URL query
        // Redirect user back to the page they were on
        const baseUrl = new URL(
          (req.headers['referer'] as string) ?? `${getURL()}/chat`
        );
        const successUrl = new URL(baseUrl);
        successUrl.searchParams.append('checkout', 'success');
        const cancelUrl = new URL(baseUrl);
        cancelUrl.searchParams.append('checkout', 'failure');

        // Check if the user already has a subscription that will be cancelled at the end of the billing period
        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('cancel_at_period_end', true)
          .maybeSingle();

        if (error) throw error;

        // Reactive existing subscription
        if (subscription) {
          const reactivatedSubscription = await stripe.subscriptions.update(
            subscription.id,
            {
              cancel_at_period_end: false,
              proration_behavior: 'create_prorations'
            }
          );

          return res
            .status(200)
            .json({ subscription: reactivatedSubscription });
        }
        // Create new subscription
        else {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer,
            line_items: [
              {
                price: price.id,
                quantity
              }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            subscription_data: {
              trial_from_plan: true,
              metadata
            },
            success_url: successUrl.toString(),
            cancel_url: cancelUrl.toString()
          });

          return res.status(200).json({ sessionId: session.id });
        }
      } else {
        const { subscriptionId } = req.body as CancelSubscriptionRequest;
        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .select('*')
          .in('status', ['trialing', 'active'])
          .single();
        if (error || !subscription || subscription.id !== subscriptionId)
          throw new Error('User subscription was not found');

        const cancelledSubscription = await stripe.subscriptions.update(
          subscriptionId,
          {
            cancel_at_period_end: true
          }
        );
        return res.status(200).json({ subscription: cancelledSubscription });
      }
    } catch (err: any) {
      console.error(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default CreateCheckoutSession;
