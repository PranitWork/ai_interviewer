import { AppDispatch } from "../Store";
import axios from "../../api/config";
import { setFeedback } from "../reducers/feedbackSlice";

// ✅ Handles multiple backend response shapes
export const generateFeedback = (id: any) => async (dispatch: AppDispatch) => {
  try {
    // Always send JSON object with interviewId
    const body =
      typeof id === "string"
        ? { interviewId: id }
        : id && typeof id === "object"
        ? id
        : { interviewId: id };

    const res = await axios.post("/feedback/generate", body, {
      withCredentials: true,
    });

    console.log("feedback response:", res.data);

    // ✅ handle all common backend shapes
    const feedbackData =
      res.data?.feedback || res.data?.data || res.data;

    if (feedbackData && (feedbackData.report || feedbackData._id)) {
      dispatch(setFeedback(feedbackData));
      return { success: true, data: feedbackData };
    }

    return { success: false, error: "Invalid feedback response", data: res.data };
  } catch (err: any) {
    console.error("generateFeedback error:", err);
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong";
    return { success: false, error: message };
  }
};
