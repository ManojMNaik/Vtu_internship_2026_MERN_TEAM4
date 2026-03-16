import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapPin, Star, Search, Navigation } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

export default function SearchTechnicians() {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    lat: "",
    lng: "",
    radiusKm: "10",
    serviceCategoryId: searchParams.get("category") || "",
    sortBy: "distance",
  });

  useEffect(() => {
    API.get("/service-categories").then((r) => setCategories(r.data.data)).catch(() => {});
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFilters((f) => ({
          ...f,
          lat: pos.coords.latitude.toString(),
          lng: pos.coords.longitude.toString(),
        }));
        toast.success("Location detected!");
      },
      () => toast.error("Could not detect location")
    );
  };

  const handleSearch = async () => {
    if (!filters.lat || !filters.lng) {
      toast.error("Please detect or enter your location first");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("lat", filters.lat);
      params.set("lng", filters.lng);
      params.set("radiusKm", filters.radiusKm);
      if (filters.serviceCategoryId) params.set("serviceCategoryId", filters.serviceCategoryId);
      params.set("sortBy", filters.sortBy);

      const res = await API.get(`/technicians/nearby?${params}`);
      setTechnicians(res.data.data);
      if (res.data.data.length === 0) toast("No technicians found in this area");
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold">Find Technicians Near You</h1>

        {/* Filters */}
        <Card className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
              <div className="flex gap-2">
                <Input placeholder="Latitude" value={filters.lat} onChange={(e) => setFilters({ ...filters, lat: e.target.value })} />
                <Input placeholder="Longitude" value={filters.lng} onChange={(e) => setFilters({ ...filters, lng: e.target.value })} />
                <Button type="button" variant="outline" onClick={detectLocation} title="Detect my location">
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select
                value={filters.serviceCategoryId}
                onChange={(e) => setFilters({ ...filters, serviceCategoryId: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Radius (km)</label>
              <select
                value={filters.radiusKm}
                onChange={(e) => setFilters({ ...filters, radiusKm: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {[5, 10, 20, 50].map((r) => (
                  <option key={r} value={r}>{r} km</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full" loading={loading}>
                <Search className="h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technicians.map((t) => (
              <Link key={t._id} to={`/technician/${t._id}`}>
                <Card className="transition hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                      {t.user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{t.user?.name}</h3>
                      <p className="text-sm text-gray-500">{t.serviceCategory?.name}</p>
                    </div>
                    {t.isAvailable && <Badge status="approved">Available</Badge>}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {t.averageRating?.toFixed(1)} ({t.reviewCount})
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {(t.distance / 1000).toFixed(1)} km
                    </span>
                    <span>{t.experienceYears} yrs exp</span>
                  </div>

                  {t.bio && <p className="mt-2 text-sm text-gray-500 line-clamp-2">{t.bio}</p>}
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && technicians.length === 0 && (
          <div className="mt-12 text-center text-gray-400">
            <Search className="mx-auto h-12 w-12" />
            <p className="mt-2">Search for technicians to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}
