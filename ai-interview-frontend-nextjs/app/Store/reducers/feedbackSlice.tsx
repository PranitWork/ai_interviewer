import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedback: [], 
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedback: (state, action) => {
      state.feedback = action.payload;
    },
  },
});

export const { setFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
