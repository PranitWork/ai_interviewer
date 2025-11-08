import { AppDispatch } from "../Store";
import axios from "../../api/config";
import { setFeedback } from "../reducers/feedbackSlice";

// ✅ Start Interview — backend returns full interview object
export const generateFeedback = (id: any) => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.post("/feedback/generate", id, {
      withCredentials: true,
    });

    console.log("feedback response:", res.data);

    // Backend sends full interview object
    if (res.data && res.data.questions) {
      dispatch(setFeedback(res.data));
      return { success: true, data: res.data };
    }

    return { success: false, error: "Invalid feedback response" };
  } catch (err: any) {
    return {
      success: false,
      error:
        err.response?.data?.message || err.message || "Something went wrong",
    };
  }
};
