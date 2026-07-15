import ForgetPasswordForm from "../_components/ForgetPasswordForm";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 text-black">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Reset your password
          </h1>
          <p className="text-sm text-black/70">
            Don’t worry — it happens. Enter your email and we’ll help you get
            back in.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-black/10 bg-white shadow-sm p-6">
          <ForgetPasswordForm />
        </div>

        {/* Footer helper */}
        <p className="text-center text-xs text-black/60">
          If you don’t see the email, check your spam folder or try again later.
        </p>
      </div>
    </div>
  );
}
