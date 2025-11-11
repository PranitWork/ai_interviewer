import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checkout: null,
  webhookData: null,
  status: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckout: (state, action) => {
      state.checkout = action.payload;
    },
    setWebhookData: (state, action) => {
      state.webhookData = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setCheckout, setWebhookData, setStatus } = checkoutSlice.actions;
export default checkoutSlice.reducer;
