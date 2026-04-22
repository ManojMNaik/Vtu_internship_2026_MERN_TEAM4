import PageWrapper from "@/components/layout/PageWrapper";
import StartupFooter from "@/components/home/StartupFooter";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By creating an account or using ServiceMate you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.`,
  },
  {
    title: "2. User Responsibilities",
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to keep your profile up to date.`,
  },
  {
    title: "3. Booking & Cancellation",
    body: `Bookings are confirmed once both the user and the assigned technician accept the service request. Users may cancel a booking before the technician begins work. Repeated no-shows or last-minute cancellations may result in temporary booking restrictions.`,
  },
  {
    title: "4. Technician Responsibilities",
    body: `Technicians must accurately represent their skills, certifications, and availability. They are expected to deliver services professionally and in a timely manner. Failure to uphold service quality may lead to profile suspension or removal.`,
  },
  {
    title: "5. Platform Role & Disclaimer",
    body: `ServiceMate acts solely as an intermediary connecting users with independent service technicians. We do not employ the technicians and are not liable for the quality, safety, or outcome of any service performed. All disputes should first be raised through our in-app support channel.`,
  },
  {
    title: "6. Account Suspension",
    body: `We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or receive repeated complaints. Users will be notified by email before any permanent action is taken.`,
  },
  {
    title: "7. Changes to Terms",
    body: `ServiceMate may update these terms from time to time. Continued use of the platform after changes are published constitutes acceptance of the revised terms.`,
  },
];

export default function TermsPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>

        <div className="mt-8 space-y-8">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
              <p className="mt-2 leading-relaxed text-gray-600">{body}</p>
            </section>
          ))}
        </div>
      </div>

      <StartupFooter />
    </PageWrapper>
  );
}
