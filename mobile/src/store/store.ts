import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice";

// The app's single Redux store. Right now it only holds player state
// (see playerSlice.ts) — if we ever needed more global state, we'd add
// another slice here.
export const store = configureStore({
  reducer: {
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
