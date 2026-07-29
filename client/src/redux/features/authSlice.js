import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isVerified: false,
        loading: true,
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isVerified = true
            state.loading = false
        },
        setError: (state, action) => {
            state.error = action.payload,
            state.loading = false
        },
        logout: (state) => {
            state.user = null
        }
    }
})

export const { setUser, setError, logout } = authSlice.actions

export default authSlice.reducer