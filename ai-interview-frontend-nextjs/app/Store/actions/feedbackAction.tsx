import { AppDispatch } from "../Store";
import axios from "../../api/config";
import { setAllFeedbacks, setFeedback } from "../reducers/feedbackSlice";

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


    // ✅ handle all common backend shapes
    const feedbackData =
      res.data?.feedback || res.data?.data || res.data;

    if (feedbackData && (feedbackData.report || feedbackData._id)) {
      dispatch(setFeedback(feedbackData));
      return { success: true, data: feedbackData };
    }

    return { success: false, error: "Invalid feedback response", data: res.data };
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong";
    return { success: false, error: message };
  }
};

export const asyncGetAllFeedbacks =()=>async(dispatch:AppDispatch)=>{
  try{
    const response = await axios.get("/feedback/all",{
      withCredentials:true,
    })
    if(response.data){
      dispatch(setAllFeedbacks(response.data));
      return {success:true,data:response.data};
    }else{
      return {success:false,error:"No feedbacks found"};
    }
  }catch(err:any){

    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong";
    return { success: false, error: message };
  }
}