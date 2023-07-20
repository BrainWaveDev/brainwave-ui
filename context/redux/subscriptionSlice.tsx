import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, useAppSelector } from './store';
import { ProductWithPrice, Subscription } from '@/types/products';
import { optimisticErrorActions } from './errorSlice';
import { getActiveProductsWithPrices } from '@/utils/app/products';
import { SupabaseClient } from '@supabase/supabase-js';

interface SubscriptionState {
  // Store information about the user's subscription here
  // since we need to use Supabase admin client to access prices
  subscription: Subscription | null;
  products: ProductWithPrice[];
}

const initialState: SubscriptionState = {
  subscription: null,
  products: []
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductWithPrice[]>) => {
      state.products = action.payload;
    },
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = action.payload;
    }
  }
});

const thunkFetchSubscriptions = (supabase: SupabaseClient): AppThunk => {
  return async (dispatch) => {
    try {
      const activeProducts = await getActiveProductsWithPrices(supabase);
      // Format prices that are displayed to the user
      activeProducts.forEach((product) => {
        if (!product.prices || product.prices.length === 0) return;

        // Currently we only have monthly subscriptions
        product.monthlyPrice = product?.prices?.find(
          (price) => price.interval === 'month'
        );
        if (!product.monthlyPrice) return;

        product.priceString = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: product.monthlyPrice.currency,
          minimumFractionDigits: 0
        }).format((product.monthlyPrice?.unit_amount || 0) / 100);
      });
      dispatch(subscriptionSlice.actions.setProducts(activeProducts));
    } catch (e: any) {
      console.error(e.message);
      dispatch(
        optimisticErrorActions.addErrorWithTimeout(
          'Failed to fetch product information'
        )
      );
    }
  };
};

const thunkFetchUserSubscription = (
  supabase: SupabaseClient,
  userId: string
): AppThunk => {
  return async (dispatch) => {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .eq('user_id', userId)
      .in('status', ['trialing', 'active'])
      .maybeSingle();

    if (error) {
      console.error(error.message);
      dispatch(
        optimisticErrorActions.addErrorWithTimeout(
          'Failed to fetch subscription information'
        )
      );
    } else {
      if (subscription) {
        dispatch(
          subscriptionSlice.actions.setSubscription({
            ...subscription,
            prices: subscription.prices
          })
        );
      }
    }
  };
};

export const optimisticSubscriptionActions = {
  fetchSubscriptions: thunkFetchSubscriptions,
  fetchUserSubscription: thunkFetchUserSubscription
};

export const getSubscriptionStateFromStorage = () =>
  useAppSelector((state) => state.subscription);

export default subscriptionSlice.reducer;
