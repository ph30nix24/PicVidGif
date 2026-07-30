import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        quary: '',
        activeTab: 'images',
        imageResults: [],
        videoResults: [],
        gifResults: [],
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
        setImageResults: (state, action) => {
            state.imageResults = action.payload
            state.loading = false
        },
        setVideoResults: (state, action) => {
            state.videoResults = action.payload
            state.loading = action.false
        },
        setGifResults: (state, action) => {
            state.gifResults = action.payload
            state.loading = action.false
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

export const { setQuary, setActiveTab, setImageResults, setVideoResults, setGifResults, setLoading, setError } = searchSlice.actions

export default searchSlice.reducer