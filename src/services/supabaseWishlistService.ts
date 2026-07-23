import { supabase } from '@/data/supabaseClient'

export const fetchWishlistFromSupabase = async (userId: string) => {
    const { data, error } = await supabase
        .from('wishlists')
        .select(`
            id,
            product_id,
            gaming_accessories (
                id, name, price, image_url, is_active
            )
        `)
        .eq('user_id', userId)

    if (error) throw error
    return data
}

export const addToWishlistSupabase = async (userId: string, productId: number) => {
    const { error } = await supabase
        .from('wishlists')
        .upsert(
            { user_id: userId, product_id: productId },
            { onConflict: 'user_id,product_id' }
        )
    if (error) throw error
}

export const removeFromWishlistSupabase = async (userId: string, productId: number) => {
    const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
    if (error) throw error
}