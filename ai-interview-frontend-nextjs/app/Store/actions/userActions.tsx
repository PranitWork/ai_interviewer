import axios from "@/app/api/config";
import { AppDispatch } from "../Store";
import { setUser } from "../reducers/userSlice";




export const asyncUpdateUser =
  (data: { name: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.put("/users/update-profile", data, {
        withCredentials: true,
      });

      // ✅ Your backend returns { message, user }
      if (response.data?.user) {
        dispatch(setUser(response.data.user));
        return {
          success: true,
          message: response.data.message,
          user: response.data.user,
        };
      } else {
        console.warn("Unexpected response structure:", response.data);
        return { success: false, message: "Unexpected server response" };
      }
    } catch (error: any) {
      console.error("❌ asyncUpdateUser Error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update profile",
      };
    }
  };
