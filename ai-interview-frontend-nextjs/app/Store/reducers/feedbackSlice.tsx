import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReportType {
  technicalScore: number;
  communication: string;
  confidence: string;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  GetAllFeedbacks:[];
}

interface FeedbackType {
  _id?: string;
  interview?: string;
  user?: string;
  report?: ReportType;
  createdAt?: string;
  updatedAt?: string;
  GetAllFeedbacks?:[];
}

interface FeedbackState {
  feedback: FeedbackType | null;
  allFeedbacks: FeedbackType[]; 
}

const initialState: FeedbackState = {
  feedback: null,
  allFeedbacks: [],
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

    setAllFeedbacks: (state, action: PayloadAction<FeedbackType[]>) => {
      state.allFeedbacks = action.payload;
    },
  },
});

export const { setFeedback,setAllFeedbacks } = feedbackSlice.actions;
export default feedbackSlice.reducer;
