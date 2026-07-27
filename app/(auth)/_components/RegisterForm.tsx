"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { registerSchema, type RegisterData } from "../schema";
import { handleRegister } from "@/lib/actions/auth-action";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";

export default function RegisterForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch("password");

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
                        <PasswordStrengthIndicator password={password} />
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