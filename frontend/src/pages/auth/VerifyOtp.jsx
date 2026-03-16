import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email, otp });
      toast.success("Email verified! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await API.post("/auth/resend-otp", { email });
      toast.success("OTP resent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not resend");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="mt-2 text-sm text-gray-500">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>

          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <Input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center text-2xl tracking-[0.5em]"
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              Verify
            </Button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
            <p className="mt-1 text-xs text-gray-400">OTP expires in 5 minutes</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
