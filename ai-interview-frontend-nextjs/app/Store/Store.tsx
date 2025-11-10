import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/app/Store/reducers/authSlice";
import  interviewSlice  from "./reducers/interviewSlice";
import  feedbackSlice  from "./reducers/feedbackSlice";
import userProfileSlice from "./reducers/userSlice"
import analyticsSlice from "./reducers/analyticsSlice"

export const store = configureStore({
  reducer: {
    authReducer: authSlice,
    interviewReducer: interviewSlice,
    feedbackReducer: feedbackSlice,
    userReducer: userProfileSlice,
    analyticsReducer : analyticsSlice
  },
});

// ✅ Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
