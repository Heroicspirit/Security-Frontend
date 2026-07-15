"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginValue } from "../schema";
import { handleLogin } from "@/lib/actions/auth-action";
import { useState, useTransition, useEffect } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      // Store token and redirect
      document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 days
      router.replace('/user/dashboard');
    } else if (error === 'google_auth_failed') {
      setServerError('Google authentication failed. Please try again.');
    }
  }, [router]); 

  const {
    register,
    handleSubmit,
    formState: { errors }, 
  } = useForm<LoginValue>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValue) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const result = await handleLogin(data);

        if (result.success) {
          // Set cookies client-side for immediate access
          document.cookie = `auth_token=${result.token}; path=/; max-age=2592000`;
          document.cookie = `user_data=${encodeURIComponent(JSON.stringify(result.data))}; path=/; max-age=2592000`;
          
          if (result.data?.role === 'admin') {
             router.replace("/admin");
          } else if (result.data?.role === 'user') {
             router.replace("/user/dashboard");
          } else {
             router.replace("/");
          }
          router.refresh(); 
        } else {
          setServerError(result.message);
        }
      } catch (error) {
        setServerError("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {serverError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
            {serverError}
          </div>
        )}

        {/* EMAIL FIELD */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#181d29] text-white outline-none transition-all focus:ring-1 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-600 text-sm ${
                errors.email ? "border-red-500/80" : "border-slate-800/80"
              }`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-400 font-medium pl-1">{errors.email.message}</p>}
        </div>

        {/* PASSWORD FIELD */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            <Link href="/forget-password" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-[#181d29] text-white outline-none transition-all focus:ring-1 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-600 text-sm ${
                errors.password ? "border-red-500/80" : "border-slate-800/80"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-red-400 font-medium pl-1">{errors.password.message}</p>}
        </div>

        {/* REMEMBER ME CHECKBOX */}
        <div className="flex items-center pt-0.5">
          <label className="flex items-center gap-2.5 cursor-pointer select-none group text-sm text-slate-400 hover:text-slate-300 transition-colors">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-800 bg-[#181d29] text-blue-500 focus:ring-0 accent-blue-500 cursor-pointer" 
            />
            <span>Remember me for 30 days</span>
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-[0.99] disabled:opacity-70 mt-2"
        >
          {isPending ? "Logging" : "Login"}
        </button>
      </form>

      {/* CONTINUITY SEPARATOR */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-x-0 h-px bg-slate-800/60" />
        <span className="relative bg-[#121620] px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Or continue with
        </span>
      </div>

      {/* SSO GOOGLE INTEGRATION */}
      <button
        type="button"
        onClick={() => window.location.href = 'http://localhost:5001/api/auth/google'}
        className="w-full bg-[#181d29] hover:bg-[#1f2535] border border-slate-800 text-slate-200 font-medium text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-colors"
      >
        <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        Google Account
      </button>

      {/* FOOTER SWITCH */}
      <div className="pt-4 text-center">
        <p className="text-sm text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 font-semibold hover:underline ml-1">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}