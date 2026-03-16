import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import { formatDate } from "../../lib/utils";

export default function TechnicianPortfolio() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", completedAt: "", image: null });
  const [submitting, setSubmitting] = useState(false);

  const fetchActivities = async () => {
    try {
      const res = await API.get("/technician-activities/me");
      setActivities(res.data.data);
    } catch {
      toast.error("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      toast.error("Please select an image");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (form.completedAt) fd.append("completedAt", form.completedAt);
      fd.append("image", form.image);

      await API.post("/technician-activities", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Portfolio item added!");
      setForm({ title: "", description: "", completedAt: "", image: null });
      setShowForm(false);
      fetchActivities();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this portfolio item?")) return;
    try {
      await API.delete(`/technician-activities/${id}`);
      toast.success("Deleted");
      fetchActivities();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Portfolio</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Add Work
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="AC Repair" />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Describe the work..."
              />
            </div>
            <Input label="Completion Date" type="date" value={form.completedAt} onChange={(e) => setForm({ ...form, completedAt: e.target.value })} />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" loading={submitting}>Upload</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Portfolio grid */}
      {activities.length === 0 ? (
        <div className="mt-12 text-center text-gray-400">
          <ImageIcon className="mx-auto h-12 w-12" />
          <p className="mt-2">No portfolio items yet. Add your first work!</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <Card key={a._id} className="overflow-hidden p-0">
              <img src={a.imageUrl} alt={a.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{a.title}</h3>
                  <button onClick={() => handleDelete(a._id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{a.description}</p>
                {a.completedAt && <p className="mt-2 text-xs text-gray-400">{formatDate(a.completedAt)}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
