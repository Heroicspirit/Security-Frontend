"use client";
import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { forgetPasswordSchema, ForgetPasswordData } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { handleRequestPasswordReset, handleGetCaptcha } from "@/lib/actions/auth-action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const ForgetPasswordForm = () => {
    const router = useRouter();
    const [pending, setTransition] = useTransition();
    const [siteKey, setSiteKey] = useState<string>('');
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ForgetPasswordData>({
        mode: "onSubmit",
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            email: "",
            recaptchaToken: "",
        }
    });

    // Fetch the reCAPTCHA site key from backend on mount
    const fetchSiteKey = useCallback(async () => {
        try {
            const result = await handleGetCaptcha();
            if (result.success && result.data?.siteKey) {
                setSiteKey(result.data.siteKey);
            }
        } catch (error) {
            console.error('Failed to fetch reCAPTCHA site key:', error);
        }
    }, []);

    useEffect(() => {
        fetchSiteKey();
    }, [fetchSiteKey]);

    const handleRecaptchaChange = (token: string | null) => {
        setValue('recaptchaToken', token || '');
    };

    const resetRecaptcha = () => {
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
        setValue('recaptchaToken', '');
    };

    const submit = (values: ForgetPasswordData) => {
        if (!values.recaptchaToken) {
            toast.error("Please complete the CAPTCHA verification.");
            return;
        }

        setTransition(async () => {
            try {
                const result = await handleRequestPasswordReset({
                    email: values.email,
                    recaptchaToken: values.recaptchaToken,
                });
                if (result.success) {
                    toast.success("If the email is registered, a reset link has been sent.");
                    return router.push('/login');
                } else {
                    throw new Error(result.message || 'Failed to send reset link');
                }
            } catch (err: Error | any) {
                toast.error(err.message || 'Failed to send reset link');
                // Reset reCAPTCHA on error
                resetRecaptcha();
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

            {/* Google reCAPTCHA Section */}
            {siteKey && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Security Verification</label>
                    <div className="flex justify-center bg-gray-50 rounded-md border border-black/20 p-3">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={siteKey}
                            onChange={handleRecaptchaChange}
                        />
                    </div>
                    <input type="hidden" {...register("recaptchaToken")} />
                    {errors.recaptchaToken?.message && (
                        <p className="text-xs text-red-600">{errors.recaptchaToken.message}</p>
                    )}
                </div>
            )}

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