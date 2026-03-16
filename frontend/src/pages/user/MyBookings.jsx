import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarCheck, Eye } from "lucide-react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { formatDateTime } from "../../lib/utils";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/me");
      setBookings(res.data.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await API.patch(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-xl font-bold">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="mt-12 text-center text-gray-400">
          <CalendarCheck className="mx-auto h-12 w-12" />
          <p className="mt-2">No bookings yet</p>
          <Link to="/search">
            <Button variant="outline" className="mt-4">Find a Technician</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {bookings.map((b) => (
            <Card key={b._id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{b.serviceCategoryId?.name}</h3>
                    <Badge status={b.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Technician: {b.technicianUserId?.name}
                  </p>
                  <p className="text-sm text-gray-500">{b.address}</p>
                  <p className="text-sm text-gray-400">
                    Scheduled: {formatDateTime(b.bookingDate)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{b.issueDescription}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/booking/${b._id}`}>
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4" /> View</Button>
                  </Link>
                  {["pending", "accepted"].includes(b.status) && (
                    <Button variant="danger" size="sm" onClick={() => handleCancel(b._id)}>
                      Cancel
                    </Button>
                  )}
                  {b.status === "completed" && (
                    <Link to={`/booking/${b._id}`}>
                      <Button variant="success" size="sm">Rate</Button>
                    </Link>
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
