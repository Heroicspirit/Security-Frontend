"use server"
import { register, login, whoAmI, updateProfile, requestPasswordReset, resetPassword, getCaptcha, exportProfile, importProfile } from "../api/auth"
import { LoginValue, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken , setUserData, clearAuthCookies } from "../cookie";
import {redirect} from "next/navigation";
import { set } from "zod";
import { revalidatePath } from "next/cache";



export const handleRegister = async (formData : RegisterData) =>{


    try {
        const result = await register(formData);

            if(result.success){
                return {
                    success : true, 
                    message : 'Registration Successful',
                    data : result.data
                };
            }

            return {
                success : false, 
                message : result.message || "Registration Failed"
            }
    }catch (err: Error | any){
        return {
            success: false, message : err.message || "Registration Failed "
        }
    }
}




export const handleLogin = async (formData : any) =>{


    try {
        const result = await login(formData);

            if(result.success){
                // Check if MFA is required
                if (result.requiresMfa) {
                    return {
                        success : true,
                        message : 'MFA verification required',
                        data : result.data,
                        requiresMfa: true
                    };
                }

                if (result.token) {
                    await setAuthToken(result.token);
                }
                if (result.data) {
                    await setUserData(result.data);
                }
                return {
                    success : true,
                    message : 'Login Successful',
                    data : result.data,
                    token: result.token,
                    requiresMfa: false
                };
            }

            return {
                success : false,
                message : result.message || "Login Failed"
            }
    }catch (err: Error | any){
        return {
            success: false, message : err.message || "Login Failed "
        }
    }
}

export const handleLogout = async () => {
    await clearAuthCookies();
    return redirect('/login');
}


export async function handleWhoAmI() {
    try {
        const result = await whoAmI();
        if (result.success) {
            return {
                success: true,
                message: 'User data fetched successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to fetch user data' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
};

export async function handleUpdateProfile(profileData: FormData) {
    try {
        const result = await updateProfile(profileData);
        if (result.success) {
            await setUserData(result.data); // update cookie 
            revalidatePath('/user/profile'); // revalidate profile page/ refresh new data
            return {
                success: true,
                message: 'Profile updated successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to update profile' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
};

export const handleRequestPasswordReset = async (email: string) => {
    try {
        const response = await requestPasswordReset(email);
        if (response.success) {
            return {
                success: true,
                message: 'Password reset email sent successfully'
            }
        }
        return { success: false, message: response.message || 'Request password reset failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Request password reset action failed' }
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await resetPassword(token, newPassword);
        if (response.success) {
            return {
                success: true,
                message: 'Password has been reset successfully'
            }
        }
        return { success: false, message: response.message || 'Reset password failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Reset password action failed' }
    }
};

export const handleGetCaptcha = async () => {
    try {
        const response = await getCaptcha();
        if (response.success) {
            return {
                success: true,
                data: response.data
            }
        }
        return { success: false, message: response.message || 'Failed to get CAPTCHA' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Get CAPTCHA action failed' }
    }
};

export const handleExportProfile = async () => {
    try {
        const response = await exportProfile();
        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: 'Profile exported successfully'
            }
        }
        return { success: false, message: response.message || 'Failed to export profile' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Export profile action failed' }
    }
};

export const handleImportProfile = async (profileData: { name?: string; profilePicture?: string; favoriteSongs?: any[] }) => {
    try {
        const response = await importProfile(profileData);
        if (response.success) {
            await setUserData(response.data);
            revalidatePath('/user/profile');
            return {
                success: true,
                data: response.data,
                message: 'Profile imported successfully'
            }
        }
        return { success: false, message: response.message || 'Failed to import profile' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Import profile action failed' }
    }
};