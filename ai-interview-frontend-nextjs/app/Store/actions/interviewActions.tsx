import { AppDispatch } from "../Store";
import axios from "../../api/config";
import { setInterview, setEvaluate } from "../reducers/interviewSlice";

// ✅ Start Interview — backend returns full interview object
export const asyncStartInterview = (data: any) => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.post("/interview/start", data, { withCredentials: true });

    if (res.data && res.data.questions) {
      dispatch(setInterview(res.data));
      return { success: true, data: res.data };
    }

    return { success: false, error: res.data?.error || "Invalid response" };

  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error || err.message,
    };
  }
};



// ✅ Evaluate Answer — backend returns feedback
export const asyncEvaluateInterview =(interviewId: string, question: string, answer: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await axios.post(
        "/interview/evaluate",
        { interviewId, question, answer },
        { withCredentials: true }
      );


      if (res.data && (res.data.feedback || res.data.score)) {
        dispatch(setEvaluate(res.data));
        return { success: true, data: res.data };
      }

      return { success: false, error: "Invalid evaluation response" };
    } catch (err: any) {
      return {
        success: false,
        error:
          err.response?.data?.message || err.message || "Evaluation failed",
      };
    }
  };


