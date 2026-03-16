import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import StarRating from "../../components/ui/StarRating";
import { formatDateTime } from "../../lib/utils";

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    API.get(`/bookings/${id}`)
      .then((res) => setBooking(res.data.data))
      .catch(() => toast.error("Failed to load booking"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      await API.post("/reviews", { bookingId: id, rating, comment });
      toast.success("Review submitted!");
      setReviewed(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (<div className="min-h-screen"><Navbar /><Spinner /></div>);
  if (!booking) return (<div className="min-h-screen"><Navbar /><p className="container-app py-12 text-center text-gray-500">Booking not found</p></div>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-app py-8">
        <Card className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Booking Details</h1>
            <Badge status={booking.status} />
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Service</span>
              <span className="font-medium">{booking.serviceCategoryId?.name}</span>

              <span className="text-gray-500">Technician</span>
              <span className="font-medium">{booking.technicianUserId?.name}</span>

              <span className="text-gray-500">Scheduled</span>
              <span className="font-medium">{formatDateTime(booking.bookingDate)}</span>

              <span className="text-gray-500">Address</span>
              <span className="font-medium">{booking.address}</span>

              <span className="text-gray-500">Issue</span>
              <span className="font-medium">{booking.issueDescription}</span>
            </div>
          </div>

          {/* Status history */}
          {booking.statusHistory?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700">Status History</h3>
              <div className="mt-2 space-y-2">
                {booking.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Badge status={h.status} />
                    <span className="text-gray-400">{formatDateTime(h.changedAt)}</span>
                    {h.note && <span className="text-gray-500">– {h.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review form for completed bookings */}
          {booking.status === "completed" && !reviewed && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-700">Rate this service</h3>
              <div className="mt-2">
                <StarRating value={rating} onChange={setRating} />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="mt-3 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Write a review (optional)..."
              />
              <Button className="mt-3" onClick={handleSubmitReview} loading={submitting}>
                Submit Review
              </Button>
            </div>
          )}

          {reviewed && (
            <div className="mt-6 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
              ✓ Thank you for your review!
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
