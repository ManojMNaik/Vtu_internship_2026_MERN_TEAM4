import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { formatDateTime } from "../../lib/utils";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchBookings = async (p = 1) => {
    try {
      const params = new URLSearchParams();
      params.set("page", p);
      params.set("limit", "15");
      if (filter) params.set("status", filter);
      const res = await API.get(`/admin/bookings?${params}`);
      setBookings(res.data.data);
      setPages(res.data.pages);
      setPage(res.data.page);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await API.patch(`/admin/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">All Bookings</h1>
        <select
          value={filter}
          onChange={(e) => { setLoading(true); setFilter(e.target.value); }}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">All Statuses</option>
          {["pending", "accepted", "rejected", "completed", "cancelled"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {bookings.length === 0 && <p className="text-center text-gray-400 py-8">No bookings found</p>}
        {bookings.map((b) => (
          <Card key={b._id} className="py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{b.serviceCategoryId?.name}</span>
                  <Badge status={b.status} />
                </div>
                <p className="text-sm text-gray-500">{b.userId?.name} → {b.technicianUserId?.name}</p>
                <p className="text-xs text-gray-400">{formatDateTime(b.bookingDate)}</p>
              </div>
              {!["completed", "cancelled", "rejected"].includes(b.status) && (
                <Button variant="danger" size="sm" onClick={() => cancelBooking(b._id)}>Cancel</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => (
            <Button key={i} size="sm" variant={page === i + 1 ? "primary" : "outline"} onClick={() => fetchBookings(i + 1)}>
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
