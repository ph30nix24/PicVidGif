import { configureStore } from "@reduxjs/toolkit";
import searchReducer from '../redux/features/searchSlice'
import authReducer from '../redux/features/authSlice'
export const store = configureStore({
    reducer: {
        search: searchReducer,
        auth: authReducer
    }
})

