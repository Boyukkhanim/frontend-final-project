// store/slices/cartSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { GameAccessory } from '../../hooks/useGameAccessories'
import {
    fetchCartFromSupabase,
    addToCartSupabase,
    removeFromCartSupabase,
    updateQtySupabase,
    clearCartSupabase,
} from '../../services/supabaseCartService'

export interface CartItem extends GameAccessory {
    quantity: number
    discountedPrice: number
}

interface CartState {
    items: CartItem[]
    loading: boolean
}

// ── AsyncThunks ───────────────────────────────────────────

export const loadCartFromSupabase = createAsyncThunk(
    'cart/loadFromSupabase',
    async (userId: string) => {
        const data = await fetchCartFromSupabase(userId)
        return data.map((row: any) => {
            const acc = Array.isArray(row.gaming_accessories)
                ? row.gaming_accessories[0]
                : row.gaming_accessories
            return {
                id: acc.id,
                name: acc.name,
                price: acc.price,
                image_url: acc.image_url,
                is_active: acc.is_active,
                quantity: row.quantity,
                discountedPrice: acc.price,
            } as CartItem
        })
    }
)

export const syncAddToCart = createAsyncThunk(
    'cart/syncAdd',
    async ({ userId, item }: { userId: string; item: CartItem }) => {
        await addToCartSupabase(userId, item.id, item.quantity)
        return item
    }
)

export const syncRemoveFromCart = createAsyncThunk(
    'cart/syncRemove',
    async ({ userId, productId }: { userId: string; productId: number }) => {
        await removeFromCartSupabase(userId, productId)
        return productId
    }
)

export const syncUpdateQty = createAsyncThunk(
    'cart/syncUpdateQty',
    async ({ userId, productId, quantity }: { userId: string; productId: number; quantity: number }) => {
        await updateQtySupabase(userId, productId, quantity)
        return { productId, quantity }
    }
)

export const syncClearCart = createAsyncThunk(
    'cart/syncClear',
    async (userId: string) => {
        await clearCartSupabase(userId)
    }
)

// ── Slice ─────────────────────────────────────────────────

const cartSlice = createSlice({
    name: 'cart',
    initialState: { items: [], loading: false } as CartState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existing = state.items.find(i => i.id === action.payload.id)
            if (existing) {
                existing.quantity += action.payload.quantity ?? 1
            } else {
                state.items.push({ ...action.payload, quantity: action.payload.quantity ?? 1 })
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(i => i.id !== action.payload)
        },
        increaseQty: (state, action: PayloadAction<number>) => {
            const item = state.items.find(i => i.id === action.payload)
            if (item) item.quantity += 1
        },
        decreaseQty: (state, action: PayloadAction<number>) => {
            const item = state.items.find(i => i.id === action.payload)
            if (item) {
                if (item.quantity > 1) item.quantity -= 1
                else state.items = state.items.filter(i => i.id !== action.payload)
            }
        },
        clearCart: (state) => {
            state.items = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCartFromSupabase.pending, (state) => { state.loading = true })
            .addCase(loadCartFromSupabase.fulfilled, (state, action) => {
                state.items = action.payload
                state.loading = false
            })
            .addCase(loadCartFromSupabase.rejected, (state) => { state.loading = false })

            // syncAdd — state-i dərhal yenilə, refresh gözləmə
            .addCase(syncAddToCart.fulfilled, (state, action) => {
                const existing = state.items.find(i => i.id === action.payload.id)
                if (existing) {
                    existing.quantity += action.payload.quantity ?? 1
                } else {
                    state.items.push({ ...action.payload, quantity: action.payload.quantity ?? 1 })
                }
            })

            .addCase(syncRemoveFromCart.fulfilled, (state, action) => {
                state.items = state.items.filter(i => i.id !== action.payload)
            })

            .addCase(syncUpdateQty.fulfilled, (state, action) => {
                const { productId, quantity } = action.payload
                const item = state.items.find(i => i.id === productId)
                if (item) {
                    if (quantity <= 0) state.items = state.items.filter(i => i.id !== productId)
                    else item.quantity = quantity
                }
            })

            .addCase(syncClearCart.fulfilled, (state) => {
                state.items = []
            })
    },
})

export const { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } = cartSlice.actions
export default cartSlice.reducer