import ResetPasswordForm from "../_components/ResetPasswordForm";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const token = resolvedParams.token as string | undefined;


  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-lg border border-black/10 bg-white p-6 text-center">
          <h1 className="text-lg font-semibold text-black">
            Invalid reset link
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            This password reset link is invalid or has expired.
            Please request a new one.
          </p>

          <Link
            href="/forget-password"
            className="mt-4 inline-block text-sm font-semibold text-black underline underline-offset-4 hover:opacity-80"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-lg border border-black/10 bg-white p-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-black">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Enter a new password for your account.
          </p>
        </div>

        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
