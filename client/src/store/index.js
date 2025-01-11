import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  token: localStorage.getItem("auth_token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload;
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("auth_token", action.payload);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("auth_token");
    },
  },
});

export const authActions = authSlice.actions;

export const store = configureStore({
  reducer: authSlice.reducer,
});