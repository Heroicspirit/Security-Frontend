import axios from "./axios";
import { LoginValue, RegisterData } from "@/app/(auth)/schema";
import {API} from "./endpoints";

interface LoginResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
  requiresMfa?: boolean;
}

export const register = async (registerData: RegisterData)=>{
    try {
        const response = await axios.post(
            API.AUTH.REGISTER, 
            registerData
        );
        return response.data; 
    }catch (err: Error | any){
        throw new Error (
            err.response?.data?.message
            || err.message
            || 'Registration Failed'
        );
    }
}


export const login = async (loginData: LoginValue): Promise<LoginResponse>=>{
    try {
        const response = await axios.post(
            API.AUTH.LOGIN,
            loginData
        );
        return response.data;
    }catch (err: Error | any){
        throw new Error (
            err.response?.data?.message
            || err.message
            || 'Login Failed'
        );
    }
}

export const whoAmI = async () => {
  try {
    const response = await axios.get(API.AUTH.WHOAMI);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message
      || error.message || 'Whoami failed');
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await axios.put(
      API.AUTH.UPDATEPROFILE,
      profileData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // for file upload/multer
        }
      }
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message
      || error.message || 'Update profile failed');
  }
};

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Request password reset failed');
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD(token), { newPassword: newPassword });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Reset password failed');
    }
}

export const generateMfaSecret = async () => {
    try {
        const response = await axios.post(API.AUTH.MFA_GENERATE_SECRET);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to generate MFA secret');
    }
}

export const enableMfa = async (token: string) => {
    try {
        const response = await axios.post(API.AUTH.MFA_ENABLE, { token });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to enable MFA');
    }
}

export const verifyMfa = async (token: string) => {
    try {
        const response = await axios.post(API.AUTH.MFA_VERIFY, { token });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to verify MFA token');
    }
}

export const disableMfa = async () => {
    try {
        const response = await axios.post(API.AUTH.MFA_DISABLE);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to disable MFA');
    }
}

export const getCaptcha = async () => {
    try {
        const response = await axios.get(API.AUTH.CAPTCHA);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to get CAPTCHA');
    }
}

export const exportProfile = async () => {
    try {
        const response = await axios.get(API.AUTH.PROFILE_EXPORT);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to export profile');
    }
}

export const importProfile = async (profileData: { name?: string; profilePicture?: string; favoriteSongs?: any[] }) => {
    try {
        const response = await axios.post(API.AUTH.PROFILE_IMPORT, profileData);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to import profile');
    }
}