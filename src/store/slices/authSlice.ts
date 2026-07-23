import { supabase } from '@/data/supabaseClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ email, password, full_name, phone }: {
        email: string;
        password: string;
        full_name: string;
        phone: string;
    }, { rejectWithValue }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name, phone } },
        });
        if (error) return rejectWithValue(error.message);
        return { id: data.user!.id, email: data.user!.email!, full_name, phone };
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return rejectWithValue(error.message);
        const user = data.user;
        return {
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name,
            phone: user.user_metadata?.phone,
        };
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await supabase.auth.signOut();
});

export const getCurrentUser = createAsyncThunk('auth/getUser', async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return {
        id: data.user.id,
        email: data.user.email!,
        full_name: data.user.user_metadata?.full_name,
        phone: data.user.user_metadata?.phone,
    };
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(logoutUser.fulfilled, (state) => { state.user = null; })

            .addCase(getCurrentUser.fulfilled, (state, action) => { state.user = action.payload; });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;