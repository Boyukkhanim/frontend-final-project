import { supabase } from '@/data/supabaseClient'

export const fetchCartFromSupabase = async (userId: string) => {
    const { data, error } = await supabase
        .from('cart')
        .select(`
            id,
            quantity,
            product_id,
            gaming_accessories (
                id, name, price, image_url, is_active
            )
        `)
        .eq('user_id', userId)

    if (error) throw error
    return data
}

export const addToCartSupabase = async (userId: string, productId: number, quantity: number) => {
    const { error } = await supabase
        .from('cart')
        .upsert(
            { user_id: userId, product_id: productId, quantity },
            { onConflict: 'user_id,product_id' }
        )
    if (error) throw error
}

export const removeFromCartSupabase = async (userId: string, productId: number) => {
    const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
    if (error) throw error
}

export const updateQtySupabase = async (userId: string, productId: number, quantity: number) => {
    if (quantity <= 0) {
        return removeFromCartSupabase(userId, productId)
    }
    const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId)
    if (error) throw error
}

export const clearCartSupabase = async (userId: string) => {
    const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)
    if (error) throw error
}