import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  interview: [], 
  evaluate:[]
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setInterview: (state, action) => {
      state.interview = action.payload;
    },
    setEvaluate: (state,action)=>{
        state.evaluate = action.payload
    }
  },
});

export const { setInterview ,setEvaluate} = interviewSlice.actions;
export default interviewSlice.reducer;
