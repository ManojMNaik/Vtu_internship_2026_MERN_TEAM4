import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CalendarCheck } from "lucide-react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { formatDateTime } from "../../lib/utils";

export default function TechnicianBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await API.get("/bookings/technician");
      setBookings(res.data.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const respond = async (id, action) => {
    try {
      await API.patch(`/bookings/${id}/respond`, { action });
      toast.success(`Booking ${action}`);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const complete = async (id) => {
    try {
      await API.patch(`/bookings/${id}/status`, { status: "completed" });
      toast.success("Marked as completed");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-xl font-bold">Booking Requests</h1>

      {bookings.length === 0 ? (
        <div className="mt-12 text-center text-gray-400">
          <CalendarCheck className="mx-auto h-12 w-12" />
          <p className="mt-2">No booking requests yet</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {bookings.map((b) => (
            <Card key={b._id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{b.serviceCategoryId?.name}</h3>
                    <Badge status={b.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Customer: {b.userId?.name} ({b.userId?.phone || b.userId?.email})</p>
                  <p className="text-sm text-gray-500">Address: {b.address}</p>
                  <p className="text-sm text-gray-400">Scheduled: {formatDateTime(b.bookingDate)}</p>
                  <p className="mt-1 text-sm text-gray-600">{b.issueDescription}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {b.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => respond(b._id, "accepted")}>Accept</Button>
                      <Button variant="danger" size="sm" onClick={() => respond(b._id, "rejected")}>Reject</Button>
                    </>
                  )}
                  {b.status === "accepted" && (
                    <Button variant="success" size="sm" onClick={() => complete(b._id)}>Mark Complete</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
