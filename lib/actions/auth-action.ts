"use server"
import { register, login, whoAmI, updateProfile, requestPasswordReset, resetPassword, exportProfile, importProfile } from "../api/auth"
import { LoginValue, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken , setUserData, clearAuthCookies } from "../cookie";
import {redirect} from "next/navigation";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";



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

export const handleRequestPasswordReset = async (data: { email: string; recaptchaToken: string }) => {
    try {
        const response = await requestPasswordReset(data);
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

export const handleCheckCaptchaRequired = async (email: string) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
        const response = await fetch(`${baseUrl}/api/auth/captcha-required?email=${encodeURIComponent(email)}`, {
            headers: { "Content-Type": "application/json" },
            credentials: 'omit',
        });
        const data = await response.json();
        
        if (data.success) {
            return {
                success: true,
                data: data.data
            }
        }
        return { success: false, message: data.message || 'Failed to check CAPTCHA status' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Check CAPTCHA action failed' }
    }
};

export const handleGetCaptcha = async () => {
    try {
        // CAPTCHA is a public endpoint - no auth required.
        // Server actions run on the server, so we must use fetch directly.
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
        
        const response = await fetch(`${baseUrl}/api/auth/captcha`, {
            headers: {
                "Content-Type": "application/json",
            },
            // Don't send cookies to avoid stale auth tokens interfering
            credentials: 'omit',
        });
        const data = await response.json();
        
        if (data.success) {
            return {
                success: true,
                data: data.data
            }
        }
        return { success: false, message: data.message || 'Failed to get CAPTCHA config' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Get CAPTCHA action failed' }
    }
};

export const handleExportProfile = async () => {
    try {
        // Read auth token from server-side cookie (client-side document.cookie is unavailable in server actions)
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return { success: false, message: "Authentication token not found. Please login again." };
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'}/api/auth/profile/export`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (data.success) {
            return {
                success: true,
                data: data.data,
                message: 'Profile exported successfully'
            }
        }
        return { success: false, message: data.message || 'Failed to export profile' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Export profile action failed' }
    }
};

export const handleImportProfile = async (profileData: { name?: string; profilePicture?: string }) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return { success: false, message: "Authentication token not found. Please login again." };
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'}/api/auth/profile/import`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (data.success) {
            await setUserData(data.data);
            revalidatePath('/user/profile');
            return {
                success: true,
                data: data.data,
                message: 'Profile imported successfully'
            }
        }
        return { success: false, message: data.message || 'Failed to import profile' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Import profile action failed' }
    }
};