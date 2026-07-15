"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { registerSchema, type RegisterData } from "../schema";
import { handleRegister } from "@/lib/actions/auth-action";

export default function RegisterForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (values: RegisterData) => {
        setServerError(null);
        
        startTransition(async () => {
            try {
                const result = await handleRegister(values);

                if (result.success) {
                    router.push("/login");
                } else {
                    setServerError(result.message);
                }
            } catch (err) {
                setServerError("An unexpected error occurred. Please try again.");
            }
        });
    };

    return (
        <div className="w-full max-w-md mx-auto text-slate-200">
            {/* Header Area matching image_91d19a.png */}
            <div className="space-y-1 mb-6">
                <h1 className="text-2xl font-bold text-white tracking-wide">Create Account</h1>
                <p className="text-xs text-slate-300/80">Join the community of performance enthusiasts.</p>
            </div>

            {/* Third-party Provider (Google Auth Placeholder) */}
            <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:5001/api/auth/google'}
                className="w-full bg-[#20242e] hover:bg-[#282d3a] border border-slate-800 text-xs font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-slate-200 transition"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                        fill="#EA4335"
                        d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.33 2.69 1.41 6.62l3.856 3.145z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M16.04 15.345c-1.077.733-2.437 1.173-4.04 1.173a7.07 7.07 0 01-6.733-4.855L1.41 14.81c1.92 3.93 5.92 6.62 10.59 6.62 3.145 0 5.973-1.055 8.04-2.873l-4-3.21z"
                    />
                    <path
                        fill="#4285F4"
                        d="M23.49 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.464a5.53 5.53 0 01-2.4 3.627l4 3.21c2.345-2.164 3.427-5.355 3.427-8.973z"
                    />
                    <path
                        fill="#34A853"
                        d="M5.266 14.235L1.41 17.38C3.33 21.31 7.33 24 12 24c3.055 0 5.782-1.145 7.91-3l-3.418-2.655a7.072 7.072 0 01-11.226-4.11z"
                    />
                </svg>
                Continue with Google
            </button>

            {/* Split Decorative Rule text element */}
            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-500/20"></div>
                <span className="flex-shrink mx-4 text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                    Or Sign Up With Email
                </span>
                <div className="flex-grow border-t border-slate-500/20"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Server error visual container block */}
                {serverError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-lg text-xs font-medium animate-in fade-in duration-200">
                        {serverError}
                    </div>
                )}

                {/* Full Name Section */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Full Name</label>
                    <input
                        {...register("name")}
                        placeholder="your name"
                        className={`w-full px-4 py-2.5 rounded-lg bg-[#1a1d26] text-white border text-xs outline-none transition-all ${
                            errors.name ? "border-red-500/60 focus:border-red-500" : "border-slate-800/80 focus:border-blue-500/60"
                        }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-400 font-medium pt-0.5">{errors.name.message}</p>}
                </div>

                {/* Email Section */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Email Address</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="your gmail account"
                        className={`w-full px-4 py-2.5 rounded-lg bg-[#1a1d26] text-white border text-xs outline-none transition-all ${
                            errors.email ? "border-red-500/60 focus:border-red-500" : "border-slate-800/80 focus:border-blue-500/60"
                        }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-400 font-medium pt-0.5">{errors.email.message}</p>}
                </div>

                {/* Double Split Grid Column Layout Container Row for Password Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Password</label>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="********"
                            className={`w-full px-4 py-2.5 rounded-lg bg-[#1a1d26] text-white border text-xs outline-none transition-all ${
                                errors.password ? "border-red-500/60 focus:border-red-500" : "border-slate-800/80 focus:border-blue-500/60"
                            }`}
                        />
                        {errors.password && <p className="text-[11px] text-red-400 font-medium pt-0.5">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Confirm Password</label>
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            placeholder="********"
                            className={`w-full px-4 py-2.5 rounded-lg bg-[#1a1d26] text-white border text-xs outline-none transition-all ${
                                errors.confirmPassword ? "border-red-500/60 focus:border-red-500" : "border-slate-800/80 focus:border-blue-500/60"
                            }`}
                        />
                        {errors.confirmPassword && <p className="text-[11px] text-red-400 font-medium pt-0.5">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                {/* Terms Acceptance node anchor block layout section */}
                <div className="flex items-center gap-2 pt-1">
                    <input 
                        type="checkbox" 
                        required 
                        className="w-3.5 h-3.5 accent-blue-500 rounded bg-[#1a1d26] border-slate-800 focus:ring-0 cursor-pointer" 
                    />
                    <span className="text-[11px] text-slate-300/90 select-none">
                        I agree to the <Link href="#" className="text-blue-400 hover:underline font-medium">Terms and Conditions</Link>
                    </span>
                </div>

                {/* Submission CTA Trigger Button Action element route handler */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#a2beff] hover:bg-[#8eb0ff] text-slate-900 font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-1.5 group shadow-lg shadow-blue-500/5 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? "Creating Account..." : "Sign Up"} 
                    {!isPending && <ArrowRight size={13} className="group-hover:translate-x-0.5 transition" />}
                </button>
            </form>

            {/* Bottom text navigation route target trigger link matching image design markup view link footer */}
            <div className="text-center mt-6">
                <p className="text-xs text-slate-300/80">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white font-bold hover:underline ml-0.5">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}