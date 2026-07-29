"use client";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { forgetPasswordSchema, ForgetPasswordData } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { handleRequestPasswordReset, handleGetCaptcha } from "@/lib/actions/auth-action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { RefreshCw } from "lucide-react";

const ForgetPasswordForm = () => {
    const router = useRouter();
    const [pending, setTransition] = useTransition();
    const [captchaData, setCaptchaData] = useState<{ sessionId: string; image: string } | null>(null);
    const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ForgetPasswordData>({
        mode: "onSubmit",
        resolver: zodResolver(forgetPasswordSchema),
    });

    // Fetch CAPTCHA on component mount
    const fetchCaptcha = async () => {
        setIsLoadingCaptcha(true);
        try {
            const result = await handleGetCaptcha();
            if (result.success && result.data) {
                setCaptchaData(result.data);
                setValue('captchaSessionId', result.data.sessionId);
            }
        } catch (error) {
            console.error('Failed to fetch CAPTCHA:', error);
        } finally {
            setIsLoadingCaptcha(false);
        }
    };

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const submit = (values: ForgetPasswordData) => {
        setTransition(async () => {
            try {
                const result = await handleRequestPasswordReset({
                    email: values.email,
                    captchaSessionId: values.captchaSessionId,
                    captchaCode: values.captchaCode,
                });
                if (result.success) {
                    toast.success("If the email is registered, a reset link has been sent.");
                    return router.push('/login');
                } else {
                    throw new Error(result.message || 'Failed to send reset link');
                }
            } catch (err: Error | any) {
                toast.error(err.message || 'Failed to send reset link');
                // Refresh CAPTCHA on error
                fetchCaptcha();
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-10 w-full rounded-md
    border border-black/20
    bg-white text-black
    placeholder:text-black/40
    px-3 text-sm
    outline-none
    focus:border-black
    focus:ring-1 focus:ring-black/30"
                    {...register("email")}
                    placeholder="you@example.com"
                />
                {errors.email?.message && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
            </div>

            {/* CAPTCHA Section */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Security Verification</label>
                <div className="flex gap-2">
                    <div className="flex-1 bg-gray-50 rounded-md border border-black/20 p-3 flex items-center justify-center min-h-[50px]">
                        {isLoadingCaptcha ? (
                            <span className="text-xs text-gray-400">Loading...</span>
                        ) : captchaData?.image ? (
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap text-center font-mono">{captchaData.image}</pre>
                        ) : (
                            <span className="text-xs text-gray-400">Failed to load CAPTCHA</span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={fetchCaptcha}
                        disabled={isLoadingCaptcha}
                        className="px-3 py-2 rounded-md border border-black/20 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoadingCaptcha ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                <input
                    {...register("captchaCode")}
                    type="text"
                    placeholder="Enter the code above"
                    className="h-10 w-full rounded-md border border-black/20 bg-white text-black placeholder:text-black/40 px-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/30"
                />
                {errors.captchaCode?.message && (
                    <p className="text-xs text-red-600">{errors.captchaCode.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
                {isSubmitting || pending ? "Sending..." : "Send Link"}
            </button>

            <div className="mt-1 text-center text-sm">
                Already have an account? <Link href="/login" className="font-semibold hover:underline">Log in</Link>
            </div>
        </form>
    );
}

export default ForgetPasswordForm;