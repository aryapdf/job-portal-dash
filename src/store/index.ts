import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import screenReducer from "./screenSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        screen: screenReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;