import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // better to use null for single user data instead of []
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authUser: (state, action) => {
      state.user = action.payload;
    }
  },
});

export const { authUser } = userSlice.actions;
export default userSlice.reducer;
