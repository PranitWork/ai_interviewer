import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReportType {
  technicalScore: number;
  communication: string;
  confidence: string;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

interface FeedbackType {
  _id?: string;
  interview?: string;
  user?: string;
  report?: ReportType;
  createdAt?: string;
  updatedAt?: string;
}

interface FeedbackState {
  feedback: FeedbackType | null;
}

const initialState: FeedbackState = {
  feedback: null,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedback: (state, action: PayloadAction<any>) => {
      // Flatten backend shape (so you can always access state.feedback.report)
      const fb = action.payload.feedback || action.payload;
      state.feedback = fb;
    },
  },
});

export const { setFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
