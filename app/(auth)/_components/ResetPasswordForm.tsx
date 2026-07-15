"use client";

import { useForm } from "react-hook-form";
import { resetPasswordSchema, ResetPasswordData } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (values: ResetPasswordData) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await handleResetPassword(token, values.newPassword);

        if (!result.success) {
          throw new Error(result.message || "Reset link is invalid or expired.");
        }

        toast.success("Password reset successful. You can now log in.");
        router.push("/login");
      } catch (err: any) {
        const message =
          err.message || "Reset link is invalid or expired.";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 text-black">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* New Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register("newPassword")}
          className="
            h-10 w-full rounded-md
            border border-black/20
            bg-white text-black
            placeholder:text-black/40
            px-3 text-sm
            outline-none
            focus:border-black
            focus:ring-1 focus:ring-black/30
          "
        />
        {errors.newPassword && (
          <p className="text-xs text-red-600">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register("confirmNewPassword")}
          className="
            h-10 w-full rounded-md
            border border-black/20
            bg-white text-black
            placeholder:text-black/40
            px-3 text-sm
            outline-none
            focus:border-black
            focus:ring-1 focus:ring-black/30
          "
        />
        {errors.confirmNewPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="
          h-10 w-full rounded-md
          bg-black text-white
          text-sm font-semibold
          hover:bg-black/90
          disabled:opacity-60
          transition
        "
      >
        {isSubmitting || pending
          ? "Resetting password..."
          : "Reset password"}
      </button>

      <div className="text-center text-sm">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold hover:underline">
          Log in
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
