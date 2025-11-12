import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/app/Store/reducers/authSlice";
import  interviewSlice  from "./reducers/interviewSlice";
import  feedbackSlice  from "./reducers/feedbackSlice";
import userProfileSlice from "./reducers/userSlice"
import analyticsSlice from "./reducers/analyticsSlice"
import userCheckoutSlice from "./reducers/checkoutSlice"
import contactSlice from "./reducers/contactSlice"

export const store = configureStore({
  reducer: {
    authReducer: authSlice,
    interviewReducer: interviewSlice,
    feedbackReducer: feedbackSlice,
    userReducer: userProfileSlice,
    analyticsReducer : analyticsSlice,
    userCheckoutReducer: userCheckoutSlice,
    contactReducer:contactSlice, 
  },
});

// ✅ Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
