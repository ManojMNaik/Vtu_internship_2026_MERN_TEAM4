import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Card from "../../components/ui/Card";
import StarRating from "../../components/ui/StarRating";
import Spinner from "../../components/ui/Spinner";
import { formatDate } from "../../lib/utils";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/reviews/me")
      .then((res) => setReviews(res.data.data))
      .catch(() => toast.error("Failed to load reviews"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-xl font-bold">My Reviews</h1>

      {reviews.length === 0 ? (
        <p className="mt-8 text-center text-gray-400">You haven't submitted any reviews yet</p>
      ) : (
        <div className="mt-4 space-y-4">
          {reviews.map((r) => (
            <Card key={r._id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Technician: {r.technicianUserId?.name}</p>
                  <StarRating value={r.rating} readonly size={16} />
                  {r.comment && <p className="mt-1 text-sm text-gray-600">{r.comment}</p>}
                </div>
                <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
