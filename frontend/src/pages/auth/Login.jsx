import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data.data;
      login(token, user);
      toast.success("Welcome back!");
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "technician") navigate("/technician/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      if (data?.data?.isVerified === false) {
        toast.error("Email not verified");
        navigate(`/verify-otp?email=${form.email}`);
      } else {
        toast.error(data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your ServiceMate account</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Register
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Want to provide services?{" "}
            <Link to="/register-technician" className="font-medium text-blue-600 hover:underline">
              Register as Technician
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
