import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfile: null, // better to use null for single user data instead of []
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userProfile = action.payload;
    }
  },
});

export const { setUser } = userProfileSlice.actions;
export default userProfileSlice.reducer;
