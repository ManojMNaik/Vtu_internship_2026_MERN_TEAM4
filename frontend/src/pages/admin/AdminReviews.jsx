import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import StarRating from "../../components/ui/StarRating";
import Spinner from "../../components/ui/Spinner";
import { formatDate } from "../../lib/utils";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await API.get("/admin/reviews");
      setReviews(res.data.data);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const toggleVisibility = async (id, isVisible) => {
    try {
      await API.patch(`/reviews/${id}/visibility`, { isVisible: !isVisible });
      toast.success(`Review ${!isVisible ? "shown" : "hidden"}`);
      fetchReviews();
    } catch {
      toast.error("Failed to update");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-xl font-bold">Review Moderation</h1>

      <div className="mt-4 space-y-4">
        {reviews.length === 0 && <p className="text-center text-gray-400 py-8">No reviews yet</p>}
        {reviews.map((r) => (
          <Card key={r._id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.userId?.name}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium">{r.technicianUserId?.name}</span>
                </div>
                <StarRating value={r.rating} readonly size={16} />
                {r.comment && <p className="mt-1 text-sm text-gray-600">{r.comment}</p>}
                <p className="mt-1 text-xs text-gray-400">{formatDate(r.createdAt)}</p>
              </div>
              <Button
                variant={r.isVisible ? "danger" : "success"}
                size="sm"
                onClick={() => toggleVisibility(r._id, r.isVisible)}
              >
                {r.isVisible ? "Hide" : "Show"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
