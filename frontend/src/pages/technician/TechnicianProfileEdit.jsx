import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";

export default function TechnicianProfileEdit() {
  const { technicianProfile, refreshUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    experienceYears: "",
    bio: "",
    address: "",
    latitude: "",
    longitude: "",
    serviceCategoryId: "",
    isAvailable: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([API.get("/service-categories")])
      .then(([catRes]) => {
        setCategories(catRes.data.data);
      })
      .catch(() => {});

    if (technicianProfile) {
      setForm({
        experienceYears: technicianProfile.experienceYears?.toString() || "",
        bio: technicianProfile.bio || "",
        address: technicianProfile.address || "",
        latitude: technicianProfile.location?.coordinates?.[1]?.toString() || "",
        longitude: technicianProfile.location?.coordinates?.[0]?.toString() || "",
        serviceCategoryId: technicianProfile.serviceCategoryId?._id || technicianProfile.serviceCategoryId || "",
        isAvailable: technicianProfile.isAvailable ?? true,
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [technicianProfile]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.patch("/technicians/profile", {
        experienceYears: Number(form.experienceYears),
        bio: form.bio,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        serviceCategoryId: form.serviceCategoryId,
      });
      toast.success("Profile updated!");
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      await API.patch("/technicians/availability", { isAvailable: !form.isAvailable });
      setForm((f) => ({ ...f, isAvailable: !f.isAvailable }));
      toast.success("Availability updated");
    } catch {
      toast.error("Failed to update availability");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Profile</h1>
        {technicianProfile && (
          <div className="flex items-center gap-2">
            <Badge status={technicianProfile.approvalStatus}>
              {technicianProfile.approvalStatus}
            </Badge>
          </div>
        )}
      </div>

      <Card className="mt-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Availability</span>
          <Button
            variant={form.isAvailable ? "success" : "secondary"}
            size="sm"
            onClick={toggleAvailability}
          >
            {form.isAvailable ? "Available" : "Unavailable"}
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Service Category</label>
            <select
              name="serviceCategoryId"
              value={form.serviceCategoryId}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input label="Experience (years)" name="experienceYears" type="number" min="0" value={form.experienceYears} onChange={handleChange} />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude" name="latitude" value={form.latitude} onChange={handleChange} />
            <Input label="Longitude" name="longitude" value={form.longitude} onChange={handleChange} />
          </div>
          <Button type="submit" loading={saving}>Save Changes</Button>
        </form>
      </Card>
    </div>
  );
}
