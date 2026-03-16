import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Star, Shield, Clock, ArrowRight } from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/service-categories")
      .then((res) => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container-app py-20 text-center lg:py-28">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Find Trusted Service
            <br />
            Professionals Nearby
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Electricians, plumbers, cleaners, AC technicians — book verified professionals in minutes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
              onClick={() => navigate("/search")}
            >
              <Search className="h-5 w-5" />
              Find Technicians
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10"
              onClick={() => navigate("/register-technician")}
            >
              Join as Technician
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-app py-16">
        <h2 className="text-center text-2xl font-bold">Why ServiceMate?</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPin, title: "Nearby Pros", desc: "Discover technicians within your area using GPS" },
            { icon: Shield, title: "Verified", desc: "Every technician is reviewed and approved" },
            { icon: Star, title: "Rated & Reviewed", desc: "Real ratings from real customers" },
            { icon: Clock, title: "Quick Booking", desc: "Book a service in under 2 minutes" },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-gray-100 py-16">
          <div className="container-app">
            <h2 className="text-center text-2xl font-bold">Service Categories</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/search?category=${cat._id}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
                    🔧
                  </div>
                  <div>
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-xs text-gray-500">{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container-app text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ServiceMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
