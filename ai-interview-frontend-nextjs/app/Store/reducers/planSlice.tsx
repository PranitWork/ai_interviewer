import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  plans: null,
};

const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    setPlans: (state, action) => {
      state.plans = action.payload;
    }
  },
});

export const { setPlans } = planSlice.actions;
export default planSlice.reducer;
