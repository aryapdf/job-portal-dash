import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    deviceType:
        typeof window !== "undefined" && window.innerWidth < 768
        ? "mobile"
        : "desktop"
};

const screenSlice = createSlice({
    name: "screen",
    initialState,
    reducers: {
        setScreenWidth: (state, action) => {
            state.width = action.payload;
            state.deviceType = action.payload < 768  ? "mobile" : "desktop";
        }
    }
})

export const { setScreenWidth } = screenSlice.actions;
export default screenSlice.reducer;