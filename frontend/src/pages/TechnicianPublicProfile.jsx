import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Briefcase, Phone, Mail, Clock } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import StarRating from "../components/ui/StarRating";
import { formatDate } from "../lib/utils";

export default function TechnicianPublicProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tech, setTech] = useState(null);
  const [activities, setActivities] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("portfolio");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, actRes, revRes] = await Promise.all([
          API.get(`/technicians/${id}`),
          API.get(`/technicians/${id}/activities`),
          API.get(`/technicians/${id}/reviews`),
        ]);
        setTech(profileRes.data.data);
        setActivities(actRes.data.data);
        setReviews(revRes.data.data);
      } catch {
        toast.error("Failed to load technician profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (<div className="min-h-screen"><Navbar /><Spinner /></div>);

  if (!tech) return (<div className="min-h-screen"><Navbar /><p className="container-app py-12 text-center text-gray-500">Technician not found</p></div>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-app py-8">
        {/* Profile header */}
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                {tech.userId?.name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold">{tech.userId?.name}</h1>
                <p className="text-sm text-gray-500">{tech.serviceCategoryId?.name}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {tech.averageRating?.toFixed(1)} ({tech.reviewCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {tech.experienceYears} yrs experience
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {tech.address || "Location not specified"}
                  </span>
                </div>
                {tech.bio && <p className="mt-2 text-sm text-gray-600">{tech.bio}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Badge status={tech.isAvailable ? "approved" : "rejected"}>
                {tech.isAvailable ? "Available" : "Unavailable"}
              </Badge>
              {user?.role === "user" && (
                <Button onClick={() => navigate(`/book/${tech._id}`)}>Book Service</Button>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mt-6 flex gap-4 border-b border-gray-200">
          {["portfolio", "reviews"].map((t) => (
            <button
              key={t}
              className={`border-b-2 px-1 pb-2 text-sm font-medium capitalize transition ${
                tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setTab(t)}
            >
              {t} ({t === "portfolio" ? activities.length : reviews.length})
            </button>
          ))}
        </div>

        {/* Portfolio */}
        {tab === "portfolio" && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.length === 0 && <p className="col-span-full text-center text-gray-400 py-8">No portfolio items yet</p>}
            {activities.map((a) => (
              <Card key={a._id} className="overflow-hidden p-0">
                <img src={a.imageUrl} alt={a.title} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{a.description}</p>
                  {a.completedAt && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatDate(a.completedAt)}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Reviews */}
        {tab === "reviews" && (
          <div className="mt-6 space-y-4">
            {reviews.length === 0 && <p className="text-center text-gray-400 py-8">No reviews yet</p>}
            {reviews.map((r) => (
              <Card key={r._id}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{r.userId?.name}</p>
                    <StarRating value={r.rating} readonly size={16} />
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                </div>
                {r.comment && <p className="mt-2 text-sm text-gray-600">{r.comment}</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
