import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/service-categories");
      setCategories(res.data.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await API.patch(`/service-categories/${editId}`, form);
        toast.success("Category updated");
      } else {
        await API.post("/service-categories", form);
        toast.success("Category created");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, description: cat.description || "" });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await API.delete(`/service-categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Service Categories</h1>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {showForm && (
        <Card className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Electrician" />
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
            <div className="flex gap-2">
              <Button type="submit" loading={submitting}>{editId ? "Update" : "Create"}</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-4 space-y-3">
        {categories.map((c) => (
          <Card key={c._id} className="flex items-center justify-between py-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{c.name}</h3>
                <Badge status={c.isActive ? "approved" : "rejected"}>
                  {c.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {c.description && <p className="text-sm text-gray-500">{c.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(c)} className="text-gray-400 hover:text-blue-600">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
