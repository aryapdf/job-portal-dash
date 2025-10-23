import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    uid: string | null;
    email: string | null;
    role: "admin" | "user" | null;
    loggedIn: boolean;
}

const initialState: UserState = {
    uid: null,
    email: null,
    role: null,
    loggedIn: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action:PayloadAction<Omit<UserState, "loggedIn">>) {
            state.uid = action.payload.uid;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.loggedIn = true;
        },
        clearUser(state) {
            state.uid = null;
            state.email = null;
            state.role = null;
            state.loggedIn = false;
        }
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;