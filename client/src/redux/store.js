import { configureStore } from "@reduxjs/toolkit";
import searchReducer from './features/searchSlice'
import authReducer from './features/authSlice'
import toastReducer from './features/toastSlice'
import collectionReducer from './features/collectionSlice'
export const store = configureStore({
    reducer: {
        search: searchReducer,
        auth: authReducer,
        toast: toastReducer,
        collection: collectionReducer
    }
})

