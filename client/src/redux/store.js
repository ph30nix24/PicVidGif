import { configureStore } from "@reduxjs/toolkit";
import searchReducer from '../redux/features/searchSlice'
export const store = configureStore({
    reducer: {
        search: searchReducer
    }
})

