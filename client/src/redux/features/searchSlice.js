import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        quary: '',
        activeTab: 'images',
        results: [],
        loading: false,
        error: null
    },
    reducers: {
        setQuary: (state, action) => {
            state.quary = action.payload
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload
        },
        setResults: (state, action) => {
            state.results = action.payload
            state.loading = false
        },
        setLoading: (state, action) => {
            state.loading = action.payload
            state.error = null
        },
        setError: (state, action) => {
            state.error = action.payload,
                state.loading = false
        },
        clearResult: (state) => {
            state.results = []
        }
    }
})

export const { setQuary, setActiveTab, setResults, setLoading, setError } = searchSlice.actions

export default searchSlice.reducer