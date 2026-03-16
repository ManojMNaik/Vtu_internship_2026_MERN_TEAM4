import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { formatDate } from "../../lib/utils";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchUsers = async (p = 1) => {
    try {
      const res = await API.get(`/admin/users?page=${p}&limit=15`);
      setUsers(res.data.data);
      setPages(res.data.pages);
      setPage(res.data.page);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (id, isActive) => {
    try {
      await API.patch(`/admin/users/${id}/status`, { isActive: !isActive });
      toast.success(`User ${!isActive ? "enabled" : "disabled"}`);
      fetchUsers(page);
    } catch {
      toast.error("Failed to update");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-xl font-bold">Manage Users</h1>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Verified</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Joined</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-100">
                <td className="py-3 font-medium">{u.name}</td>
                <td className="py-3 text-gray-500">{u.email}</td>
                <td className="py-3"><Badge status={u.role === "admin" ? "approved" : "pending"}>{u.role}</Badge></td>
                <td className="py-3">{u.isVerified ? "✓" : "✗"}</td>
                <td className="py-3"><Badge status={u.isActive ? "approved" : "rejected"}>{u.isActive ? "Active" : "Disabled"}</Badge></td>
                <td className="py-3 text-gray-400">{formatDate(u.createdAt)}</td>
                <td className="py-3">
                  {u.role !== "admin" && (
                    <Button
                      variant={u.isActive ? "danger" : "success"}
                      size="sm"
                      onClick={() => toggleStatus(u._id, u.isActive)}
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i + 1 ? "primary" : "outline"}
              onClick={() => fetchUsers(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
