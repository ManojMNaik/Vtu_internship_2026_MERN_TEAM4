import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("OTP sent to your email!");
      navigate(`/verify-otp?email=${form.email}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Register to book services on ServiceMate</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Full Name" name="name" placeholder="Amit Kumar" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            <Input label="Phone" name="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={handleChange} />
            <Input label="Password" name="password" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={handleChange} required minLength={8} />
            <Button type="submit" className="w-full" loading={loading}>
              Register
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
