// store/slices/wishlistSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { GameAccessory } from '../../hooks/useGameAccessories'
import {
    fetchWishlistFromSupabase,
    addToWishlistSupabase,
    removeFromWishlistSupabase,
} from '../../services/supabaseWishlistService'

interface WishlistState {
    items: GameAccessory[]
    loading: boolean
}

// ── AsyncThunks ───────────────────────────────────────────

export const loadWishlistFromSupabase = createAsyncThunk(
    'wishlist/loadFromSupabase',
    async (userId: string) => {
        const data = await fetchWishlistFromSupabase(userId)

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
            } as GameAccessory
        })
    }
)

export const syncToggleWishlist = createAsyncThunk(
    'wishlist/syncToggle',
    async ({ userId, item, isInWishlist }: {
        userId: string
        item: GameAccessory
        isInWishlist: boolean
    }) => {
        if (isInWishlist) {
            await removeFromWishlistSupabase(userId, item.id)
        } else {
            await addToWishlistSupabase(userId, item.id)
        }
        return { item, isInWishlist }
    }
)

// ── Slice ─────────────────────────────────────────────────

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: { items: [], loading: false } as WishlistState,
    reducers: {
        setWishlist: (state, action: PayloadAction<GameAccessory[]>) => {
            state.items = action.payload
        },
        // Guest üçün - yalnız local state
        toggleWishlist: (state, action: PayloadAction<GameAccessory>) => {
            const exists = state.items.find(i => i.id === action.payload.id)
            if (exists) {
                state.items = state.items.filter(i => i.id !== action.payload.id)
            } else {
                state.items.push(action.payload)
            }
        },
        clearWishlist: (state) => {
            state.items = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadWishlistFromSupabase.pending, (state) => { state.loading = true })
            .addCase(loadWishlistFromSupabase.fulfilled, (state, action) => {
                state.items = action.payload
                state.loading = false
            })
            .addCase(loadWishlistFromSupabase.rejected, (state) => { state.loading = false })

            .addCase(syncToggleWishlist.fulfilled, (state, action) => {
                const { item, isInWishlist } = action.payload
                if (isInWishlist) {
                    state.items = state.items.filter(i => i.id !== item.id)
                } else {
                    state.items.push(item)
                }
            })
    },
})

export const { setWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer