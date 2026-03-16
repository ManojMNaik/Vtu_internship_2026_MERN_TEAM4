import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";

export default function AdminTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchTechnicians = async () => {
    try {
      const q = filter ? `?approvalStatus=${filter}` : "";
      const res = await API.get(`/admin/technicians${q}`);
      setTechnicians(res.data.data);
    } catch {
      toast.error("Failed to load technicians");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTechnicians(); }, [filter]);

  const updateApproval = async (id, approvalStatus) => {
    try {
      await API.patch(`/admin/technicians/${id}/approval`, { approvalStatus });
      toast.success(`Technician ${approvalStatus}`);
      fetchTechnicians();
    } catch {
      toast.error("Failed to update");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Manage Technicians</h1>
        <select
          value={filter}
          onChange={(e) => { setLoading(true); setFilter(e.target.value); }}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mt-4 space-y-4">
        {technicians.length === 0 && <p className="text-center text-gray-400 py-8">No technicians found</p>}
        {technicians.map((t) => (
          <Card key={t._id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{t.userId?.name}</h3>
                  <Badge status={t.approvalStatus} />
                </div>
                <p className="text-sm text-gray-500">{t.userId?.email} · {t.serviceCategoryId?.name}</p>
                <p className="text-sm text-gray-400">{t.experienceYears} yrs · {t.address}</p>
              </div>
              <div className="flex gap-2">
                {t.approvalStatus !== "approved" && (
                  <Button size="sm" onClick={() => updateApproval(t._id, "approved")}>
                    Approve
                  </Button>
                )}
                {t.approvalStatus !== "rejected" && (
                  <Button variant="danger" size="sm" onClick={() => updateApproval(t._id, "rejected")}>
                    Reject
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
