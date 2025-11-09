import axios from "@/app/api/config";
import { AppDispatch } from "../Store";
import { setUser } from "../reducers/userSlice";

export const asyncgetUser = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get("/users/profile", {
      withCredentials: true,
    });

    if (response.data && response.data.data) {
      const userData = response.data.data;
      dispatch(setUser(userData));

      return {
        success: true,
        user: userData,
      };
    }

    if (response.data && response.data._id) {
      const userData = response.data;
      dispatch(setUser(userData));

      return {
        success: true,
        user: userData,
      };
    }

    return {
      success: false,
      message: "User data not found in response",
    };
  } catch (error: any) {
    console.error("❌ Error fetching user:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user",
    };
  }
};



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
