import axios from "@/app/api/config"
import { AppDispatch } from "../Store"
import { setPlans } from "../reducers/planSlice";

export const asyncgetPlans = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await axios.get("/plans", {
      withCredentials: true,
    });
    if (data.success) {
      dispatch(setPlans(data.plans));  // ⬅ your backend must return {success, plans: [...] }
      return { success: true };
    }
    return { success: false, message: data.message };
  } catch (error) {

    return { success: false, message: "Failed to fetch plans" };
  }
};
