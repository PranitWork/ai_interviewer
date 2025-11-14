import axios from "@/app/api/config";
import { AppDispatch } from "../Store";
import { setCheckout, setCoupon, setStatus } from "../reducers/checkoutSlice";

// CREATE CHECKOUT
export const asynccheckout = (payload: any) => async (dispatch: AppDispatch) => {
  try {
    const { data } = await axios.post("/subscription/create", payload, {
      withCredentials: true,
    });


    if (data.success) {
      dispatch(setCheckout(data));
      return { success: true, data };
    }

    return { success: false, message: data.message };

  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || "Checkout failed" };
  }
};


// GET STATUS
export const asyncstatus = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await axios.get("/subscription/status", {
      withCredentials: true,
    });

    if (data.success) {
      dispatch(setStatus(data));
      return { success: true };
    } else return { success: false };
  } catch {
    return { success: false, message: "Status error" };
  }
};

// CANCEL
export const asynccancel = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await axios.put(
      "/subscription/cancel",
      {},
      {
        withCredentials: true,
      }
    );

    return { success: data.success, message: data.message };
  } catch {
    return { success: false, message: "Cancel failed" };
  }
};

export const asyncApplyCoupon =(code: string, amount: number) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.post(
        "/coupon/apply",
        { code, amount },
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(setCoupon(data)); // optional, if saving
        return { success: true, data };
      }

      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Coupon apply failed" };
    }
  };
