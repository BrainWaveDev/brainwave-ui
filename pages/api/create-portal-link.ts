import { NextApiHandler } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '@/utils/stripe';
import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
import { getReturnOrigin } from '@/utils/helpers';

const CreatePortalLink: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const supabase = createPagesServerClient({ req, res });
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) throw Error('Could not get user');
      const customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || ''
      });

      if (!customer) throw Error('Could not get customer');

      // Return information about whether the checkout was successful in the URL query
      // Redirect user back to the page they were on
      const returnUrl = getReturnOrigin(req);
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: returnUrl
      });

      return res.status(200).json({ url });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default CreatePortalLink;
