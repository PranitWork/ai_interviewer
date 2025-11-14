import { setUserAnalytics } from "../reducers/analyticsSlice";
import { AppDispatch } from "../Store";
import axios from "@/app/api/config";

export const getUserAnalytics = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get("/analytics/user", {
      withCredentials: true,
    });

    if (response.data?.success && response.data?.data) {
      dispatch(setUserAnalytics(response.data.data));
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: response.data };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
