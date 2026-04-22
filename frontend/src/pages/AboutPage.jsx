import { ShieldCheck, CalendarCheck, Users } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import StartupFooter from "@/components/home/StartupFooter";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Technicians",
    description:
      "Every technician on our platform is background-verified and skill-assessed so you can book with confidence.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description:
      "Browse services, pick a time slot, and confirm — your booking is done in under a minute.",
  },
  {
    icon: Users,
    title: "Built on Reliability",
    description:
      "Real reviews, transparent pricing, and dedicated support ensure a consistently great experience.",
  },
];

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">About ServiceMate</h1>

        <div className="mt-6 space-y-6">
          <p className="leading-relaxed text-gray-600">
            ServiceMate is a modern home-services platform that connects homeowners with
            skilled, verified technicians — from plumbers and electricians to AC
            specialists and appliance repair pros. We believe getting things fixed at
            home should be as effortless as ordering food online.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">Our Mission</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              To simplify service booking for every household. Whether it's an urgent
              leak at midnight or a scheduled AC tune-up, ServiceMate makes it easy to
              find the right professional, at the right price, at the right time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Why People Choose ServiceMate
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <StartupFooter />
    </PageWrapper>
  );
}
