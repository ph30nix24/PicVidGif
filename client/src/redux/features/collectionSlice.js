import { createSlice } from "@reduxjs/toolkit";

export const collectionSlice = createSlice({
    name: 'collection',
    initialState: {
        items: [],
        loading: true,
        error: null
    },
    reducers: {
        setCollection: (state, action) => {
            state.items = action.payload || [];
            state.loading = false
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})

export const {
    setCollection,
    setLoading,
    setError
} = collectionSlice.actions

export default collectionSlice.reducer