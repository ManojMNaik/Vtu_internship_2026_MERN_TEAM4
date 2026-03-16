import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function RegisterTechnician() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    serviceCategoryId: "",
    experienceYears: "",
    address: "",
    bio: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    API.get("/service-categories").then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
        toast.success("Location detected!");
        setDetectingLocation(false);
      },
      () => {
        toast.error("Could not detect location");
        setDetectingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      toast.error("Please detect or enter your location");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register-technician", {
        ...form,
        experienceYears: Number(form.experienceYears),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });
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
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg">
          <h1 className="text-2xl font-bold">Register as Technician</h1>
          <p className="mt-1 text-sm text-gray-500">Join ServiceMate to receive booking requests</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full Name" name="name" placeholder="Ravi Kumar" value={form.name} onChange={handleChange} required />
              <Input label="Phone" name="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={handleChange} required />
            </div>
            <Input label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            <Input label="Password" name="password" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={handleChange} required minLength={8} />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Service Category</label>
              <select
                name="serviceCategoryId"
                value={form.serviceCategoryId}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Experience (years)" name="experienceYears" type="number" min="0" placeholder="3" value={form.experienceYears} onChange={handleChange} required />
              <Input label="Address" name="address" placeholder="Chennai, Tamil Nadu" value={form.address} onChange={handleChange} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Bio (optional)</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={2}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Brief about your skills..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
              <div className="flex gap-2">
                <Input placeholder="Latitude" name="latitude" value={form.latitude} onChange={handleChange} />
                <Input placeholder="Longitude" name="longitude" value={form.longitude} onChange={handleChange} />
                <Button type="button" variant="outline" onClick={detectLocation} loading={detectingLocation}>
                  Detect
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Register as Technician
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">Login</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
