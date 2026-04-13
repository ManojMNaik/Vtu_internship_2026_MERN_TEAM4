import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthNavbar from "@/components/common/AuthNavbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

const maskEmail = (value) => {
  if (!value || !value.includes("@")) return value;
  const [name, domain] = value.split("@");
  if (!name) return value;
  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(name.length - 2, 1))}@${domain}`;
};

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();
  const stateEmail = location.state?.email || "";
  const [fallbackEmail, setFallbackEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const resolvedEmail = (stateEmail || fallbackEmail).trim();

  const startCooldown = useCallback(() => {
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleResendOtp = async () => {
    if (!resolvedEmail) {
      toast.error("Please enter your email first.");
      return;
    }
    setResending(true);
    try {
      await api.post("/auth/resend-otp", { email: resolvedEmail });
      toast.success("OTP resent to your email");
      startCooldown();
    } catch (apiError) {
      toast.error(apiError?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!resolvedEmail || !otp.trim()) {
      const validationMessage = "Email and OTP are required.";
      setError(validationMessage);
      toast.error(validationMessage);
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ email: resolvedEmail, otp }, navigate);
      toast.success("Account verified successfully!");
    } catch (apiError) {
      const errorMessage = apiError?.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50">
      <AuthNavbar />
      <div className="px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-primary">Verify OTP</h1>
        <p className="mt-2 text-sm text-slate-500">
          {stateEmail ? `OTP sent to ${maskEmail(stateEmail)}` : "Enter the code sent to your email."}
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {!stateEmail ? (
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
              type="email"
              placeholder="Email"
              value={fallbackEmail}
              onChange={(event) => setFallbackEmail(event.target.value)}
              required
            />
          ) : null}
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 tracking-[0.25em] focus:border-primary focus:outline-none"
            placeholder="OTP"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            minLength={4}
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button className="w-full" variant="accent" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm font-medium text-accent hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleResendOtp}
            disabled={resending || cooldown > 0}
          >
            {resending
              ? "Resending..."
              : cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : "Didn't get the code? Resend OTP"}
          </button>
        </div>
        <p className="mt-3 text-center text-sm text-slate-600">
          Need an account?{" "}
          <Link className="font-semibold text-accent" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
      </div>
    </main>
  );
}
