import PageWrapper from "@/components/layout/PageWrapper";
import StartupFooter from "@/components/home/StartupFooter";

const sections = [
  {
    title: "1. Information We Collect",
    body: `When you register or use ServiceMate we may collect the following personal information: full name, email address, phone number, location (city / state), and booking history. Technicians may additionally provide service categories, certifications, and portfolio images.`,
  },
  {
    title: "2. How We Use Your Data",
    body: `Your data is used to operate the platform — this includes creating your account, matching you with technicians, processing bookings, sending OTP and transactional emails, and improving the overall service experience. We do not sell your personal data to third parties.`,
  },
  {
    title: "3. Data Sharing",
    body: `Personal information is shared only when necessary to fulfil a booking. For example, your name and contact details may be shared with the technician assigned to your service request. We may also share data when required by law or to protect the safety of our users.`,
  },
  {
    title: "4. Data Security",
    body: `We implement industry-standard security measures to protect your information. Passwords are hashed using bcrypt, authentication is managed through signed JSON Web Tokens (JWT), and database access is restricted and encrypted in transit. Despite best efforts, no system is 100 % secure.`,
  },
  {
    title: "5. Cookies & Local Storage",
    body: `ServiceMate uses browser local storage to persist your authentication session. We do not use third-party tracking cookies. Minimal, essential cookies may be set for security and performance.`,
  },
  {
    title: "6. Your Rights",
    body: `You may request access to, correction of, or deletion of your personal data at any time by contacting our support team. Upon account deletion, we will remove your personal data within a reasonable timeframe, except where retention is required by law.`,
  },
  {
    title: "7. Changes to This Policy",
    body: `We may update this Privacy Policy periodically. Material changes will be communicated via email or an in-app notice. Continued use of the platform after an update constitutes your acceptance.`,
  },
];

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Privacy Policy</h1>
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
