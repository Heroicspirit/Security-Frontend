"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import { loginSchema, type LoginValue } from "../schema";
import { handleLogin, handleGetCaptcha, handleCheckCaptchaRequired } from "@/lib/actions/auth-action";
import { useState, useTransition, useEffect, useRef } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [captchaData, setCaptchaData] = useState<{ sessionId: string; image: string } | null>(null);
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [mfaToken, setMfaToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = watch("email");

  // Debounced check: when the user types an email, check if captcha is needed from the server
  useEffect(() => {
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
    }

    if (emailValue && emailValue.includes('@')) {
      emailTimeoutRef.current = setTimeout(async () => {
        try {
          const result = await handleCheckCaptchaRequired(emailValue);
          if (result.success && result.data?.required) {
            setCaptchaRequired(true);
            fetchCaptcha();
          } else {
            setCaptchaRequired(false);
            setCaptchaData(null);
          }
        } catch {
          // Silently fail — captcha check is non-critical
        }
      }, 500);
    }

    return () => {
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current);
      }
    };
  }, [emailValue]);

  const fetchCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      const result = await handleGetCaptcha();
      if (result.success && result.data) {
        setCaptchaData(result.data);
        setValue('captchaSessionId', result.data.sessionId);
        setCaptchaRequired(true);
      }
    } catch (error) {
      console.error('Failed to fetch CAPTCHA:', error);
    } finally {
      setIsLoadingCaptcha(false);
    }
  }; 

  const onSubmit = async (data: LoginValue) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const result = await handleLogin(data);

        if (result.success) {
          // Check if MFA is required
          if (result.requiresMfa) {
            setRequiresMfa(true);
            setUserEmail(data.email);
            return;
          }

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
          // Failed login — require captcha on retry
          setCaptchaRequired(true);
          fetchCaptcha();
        }
      } catch (error) {
        setServerError("An unexpected error occurred. Please try again.");
        // On error, also require captcha
        setCaptchaRequired(true);
        fetchCaptcha();
      }
    });
  };

  const onMfaSubmit = async () => {
    setServerError(null);

    if (!mfaToken || mfaToken.length !== 6) {
      setServerError("Please enter a valid 6-digit MFA code");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("http://localhost:5001/api/auth/login-mfa-verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            token: mfaToken,
          }),
        });

        const result = await response.json();

        if (result.success) {
          // If MFA was corrupted and auto-reset, redirect to login fresh
          if (result.mfaReset) {
            setRequiresMfa(false);
            setMfaToken("");
            setUserEmail("");
            setServerError("Your MFA was corrupted and has been reset. Please log in normally and re-enable MFA from settings.");
            return;
          }

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

        {/* CAPTCHA FIELD — only shown when required */}
        {captchaRequired && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Security Verification</label>
            <div className="flex gap-3">
              {/* CAPTCHA Image */}
              <div className="flex-1 bg-[#181d29] rounded-xl border border-slate-800/80 p-3 flex items-center justify-center min-h-[60px]">
                {isLoadingCaptcha ? (
                  <div className="text-slate-500 text-xs">Loading...</div>
                ) : captchaData?.image ? (
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap text-center">{captchaData.image}</pre>
                ) : (
                  <div className="text-slate-500 text-xs">Failed to load CAPTCHA</div>
                )}
              </div>
              {/* Refresh Button */}
              <button
                type="button"
                onClick={fetchCaptcha}
                disabled={isLoadingCaptcha}
                className="px-3 py-2 rounded-xl border border-slate-800/80 bg-[#181d29] text-slate-400 hover:text-slate-300 hover:border-slate-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoadingCaptcha ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {/* CAPTCHA Input */}
            <input
              {...register("captchaCode")}
              type="text"
              placeholder="Enter the code above"
              className={`w-full px-4 py-3 rounded-xl border bg-[#181d29] text-white outline-none transition-all focus:ring-1 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-600 text-sm ${
                errors.captchaCode ? "border-red-500/80" : "border-slate-800/80"
              }`}
            />
            {errors.captchaCode && <p className="text-[11px] text-red-400 font-medium pl-1">{errors.captchaCode.message}</p>}
          </div>
        )}

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
        {!requiresMfa ? (
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-[0.99] disabled:opacity-70 mt-2"
          >
            {isPending ? "Logging" : "Login"}
          </button>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">MFA Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={mfaToken}
                onChange={(e) => setMfaToken(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-[#181d29] text-white outline-none transition-all focus:ring-1 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-600 text-sm border-slate-800/80 text-center tracking-widest text-lg"
              />
            </div>
            <button
              type="button"
              onClick={onMfaSubmit}
              disabled={isPending}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-[0.99] disabled:opacity-70"
            >
              {isPending ? "Verifying" : "Verify MFA"}
            </button>
            <button
              type="button"
              onClick={() => {
                setRequiresMfa(false);
                setMfaToken("");
                setUserEmail("");
              }}
              className="w-full text-slate-400 hover:text-slate-300 text-xs font-medium"
            >
              Back to login
            </button>
          </div>
        )}
      </form>

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