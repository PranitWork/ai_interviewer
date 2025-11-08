import { AppDispatch } from "../Store";
import axios from "../../api/config";
import { setInterview, setEvaluate } from "../reducers/interviewSlice";

// ✅ Start Interview — backend returns full interview object
export const asyncStartInterview =(role: any) => async (dispatch: AppDispatch) => {
    try {
      const res = await axios.post("/interview/start", role, {
        withCredentials: true,
      });

      console.log("Interview start response:", res.data);

      // Backend sends full interview object
      if (res.data && res.data.questions) {
        dispatch(setInterview(res.data));
        return { success: true, data: res.data };
      }

      return { success: false, error: "Invalid interview response" };
    } catch (err: any) {
      console.error("Interview start error:", err);
      return {
        success: false,
        error:
          err.response?.data?.message || err.message || "Something went wrong",
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

      console.log("Evaluate response:", res.data);

      if (res.data && (res.data.feedback || res.data.score)) {
        dispatch(setEvaluate(res.data));
        return { success: true, data: res.data };
      }

      return { success: false, error: "Invalid evaluation response" };
    } catch (err: any) {
      console.error("Interview evaluate error:", err);
      return {
        success: false,
        error:
          err.response?.data?.message || err.message || "Evaluation failed",
      };
    }
  };

export const asyncGetInterviewDetails =(interviewId: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get(`/interview/${interviewId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setInterview(response.data.data));
      } else {
        return { error: response.data.message };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  };

export const asyncGetUserInterviews = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get("interview", {
      withCredentials: true,
    });
    if (response.data.success) {
      dispatch(setInterview(response.data.data));
    } else {
      return { error: response.data.message };
    }
  } catch (error: any) {
    return { error: error.message };
  }
};
