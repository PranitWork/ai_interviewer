import axios from "../../api/config";
import { setContact } from "../reducers/contactSlice";
import type { AppDispatch } from "../Store";

export const asyncContact = (data: any) => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.post("/contact/", data, {
      withCredentials: true,
    });

    if (res.data?.success) {
      // If you want to store contact form data in Redux
      dispatch(setContact(data));
      return { success: true, message: res.data.message || "Message sent successfully" };
    } else {
      return { success: false, message: res.data?.message || "Failed to send the form" };
    }
  } catch (err: any) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.msg ||
      err.message ||
      "Something went wrong!";
    return { success: false, message: backendMsg };
  }
};
