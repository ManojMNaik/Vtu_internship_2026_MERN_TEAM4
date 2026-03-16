import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Users, Wrench, CalendarCheck, CheckCircle, Clock, MessageSquare } from "lucide-react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/dashboard")
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const tiles = [
    { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Total Technicians", value: stats?.totalTechnicians, icon: Wrench, color: "bg-purple-100 text-purple-600" },
    { label: "Total Bookings", value: stats?.totalBookings, icon: CalendarCheck, color: "bg-orange-100 text-orange-600" },
    { label: "Completed", value: stats?.completedBookings, icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Pending Approvals", value: stats?.pendingTechnicians, icon: Clock, color: "bg-yellow-100 text-yellow-600" },
    { label: "Total Reviews", value: stats?.totalReviews, icon: MessageSquare, color: "bg-pink-100 text-pink-600" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value ?? 0}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
