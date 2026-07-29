import { configureStore } from "@reduxjs/toolkit";
import searchReducer from './features/searchSlice'
import authReducer from './features/authSlice'
import toastReducer from './features/toastSlice'
export const store = configureStore({
    reducer: {
        search: searchReducer,
        auth: authReducer,
        toast: toastReducer
    }
})

