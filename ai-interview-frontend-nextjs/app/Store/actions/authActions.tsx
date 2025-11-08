import axios from "../../api/config";
import { authUser } from "../reducers/authSlice";
import type { AppDispatch } from "../Store";

export const asyncCurrentUser = () => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get("/auth/current-user", {
      withCredentials: true,
    });

    if (res.data?.user) {
      dispatch(authUser(res.data.user));
      return { success: true, message: res.data.message || "User fetched successfully" };
    } else {
      return { success: false, message: res.data?.message || "No user data found" };
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

export const asyncRegisterUser = (data:any) => async (dispatch:AppDispatch)=>{
    try{
        const res = await axios.post("/auth/register",data,{
            withCredentials:true,
        });
        console.log("Register Response:", res);
        if(res.data?.user){
            await dispatch(authUser(res.data.user));
            return {success: true, message: res.data.message || "Registration successful"};
        }else{
            return {success: false, message: res.data?.message || "Registration failed"};
        }
    }catch(err:any){
        const backendMsg = err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Something went wrong!";
    return { success: false, message: backendMsg };
    }
}

export const asyncLoginUser =(data:any)=>async (dispatch: AppDispatch)=>{
    try{
        const res = await axios.post("/auth/login",data,{
            withCredentials:true,
        });
        if(res.data?.user){
            await dispatch(authUser(res.data.user));
            return {success: true, message: res.data.message || "Login successful"};
        }else{
            return {success: false, message: res.data?.message || "Login failed"};
        }
    }catch(err:any){
         const backendMsg = err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Something went wrong!";
    return { success: false, message: backendMsg };
    }
}

export const asyncForgotPassword = (email: string) => async () => {
  try {
    const res = await axios.post("/auth/forgot-password", { email });
     const resetUrl = res.data?.resetUrl;
    return { success: true,resetUrl, message: res.data.message|| "Reset link sent!" };
  } catch (err: any) {
    const backendMsg =
      err.response?.data?.message || err.response?.data?.msg || err.message || "Something went wrong!";
    return { success: false, message: backendMsg };
  }
};

export const asyncResetPassword = (token: string, data: any) => async () => {
  try {
    const res = await axios.put(`/auth/reset-password/${token}`, data);
    return { success: true, message: res.data.message || "Password reset successful!" };
  } catch (err: any) {
    const backendMsg =
      err.response?.data?.message || err.response?.data?.msg || err.message || "Something went wrong!";
    return { success: false, message: backendMsg };
  }
};

export const asyncLogoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await axios.get("/auth/logout", { withCredentials: true });
    dispatch(authUser(null));
    return { success: true, message: "Logged out successfully" };
  } catch (err: any) {
    const backendMsg =
      err.response?.data?.message || err.response?.data?.msg || err.message || "Logout failed!";
    return { success: false, message: backendMsg };
  }
};

// ✅ Google Login
export const asyncGoogleLogin = (credential: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.post(
      "/auth/google-login",
      { credential }, // backend expects { credential }
      { withCredentials: true }
    );

    if (res.data?.user) {
      dispatch(authUser(res.data.user));
      return { success: true, message: res.data.message || "Google login successful" };
    } else {
      return { success: false, message: res.data?.message || "Google login failed" };
    }
  } catch (err: any) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.msg ||
      err.message ||
      "Something went wrong during Google login!";
    return { success: false, message: backendMsg };
  }
};
