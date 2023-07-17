import { ProductWithPrice } from '@/types/products';
import { SupabaseClient } from '@supabase/supabase-js';

export const getActiveProductsWithPrices = async (
  supabase: SupabaseClient
): Promise<ProductWithPrice[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
    throw error;
  } else {
    return (data as any) || [];
  }
};
