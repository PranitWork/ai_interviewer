import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/app/Store/reducers/authSlice";

export const store = configureStore({
  reducer: {
    authReducer: authSlice,
  },
});

// ✅ Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
