import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LastFeedback {
  technicalScore: number;
  communication: string;
  confidence: string;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

interface UserAnalytics {
  totalInterviews: number;
  totalFeedbacks: number;
  currentPlan: string;
  planExpiry: string | null;
  lastFeedback: LastFeedback | null;
}

interface AnalyticsState {
  userAnalytics: UserAnalytics | null;
  adminAnalytics: any; // You can refine later
}

const initialState: AnalyticsState = {
  userAnalytics: null,
  adminAnalytics: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setUserAnalytics: (state, action: PayloadAction<UserAnalytics>) => {
      state.userAnalytics = action.payload;
    },
    setAdminAnalytics: (state, action) => {
      state.adminAnalytics = action.payload;
    },
  },
});

export const { setUserAnalytics, setAdminAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
