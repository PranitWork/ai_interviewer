import axios from "@/app/api/config";
import { AppDispatch } from "../Store";
import { setCheckout, setStatus } from "../reducers/checkoutSlice";

// CREATE CHECKOUT
export const asynccheckout =
  (plan: { plan: string }) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.post("/subscription/create", plan, {
        withCredentials: true,
      });

      if (data.success) {
        dispatch(setCheckout(data));
        return { success: true };
      } else return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: "Checkout failed" };
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
    const { data } = await axios.put("/subscription/cancel", {}, {
      withCredentials: true,
    });

    return { success: data.success, message: data.message };
  } catch {
    return { success: false, message: "Cancel failed" };
  }
};
