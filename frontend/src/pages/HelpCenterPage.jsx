import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/layout/PageWrapper";
import StartupFooter from "@/components/home/StartupFooter";

const helpSections = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I create an account?",
        a: 'Click "Get Started" on the home page, fill in your details, and verify the OTP sent to your email.',
      },
      {
        q: "What roles are available?",
        a: "You can sign up as a User (to book services) or as a Technician (to offer services). Admin accounts are managed internally.",
      },
      {
        q: "Do I need to verify my email?",
        a: "Yes. A 6-digit OTP is sent to your email during signup. You must verify it before you can log in.",
      },
    ],
  },
  {
    category: "Booking Help",
    items: [
      {
        q: "How do I book a service?",
        a: "Browse available technicians, choose a service, pick a date and time slot, and confirm your booking.",
      },
      {
        q: "Can I cancel a booking?",
        a: "Yes, you can cancel a pending booking from the My Bookings page before the technician starts work.",
      },
      {
        q: "How do I pay?",
        a: "Payment is currently handled directly between you and the technician. Online payments will be supported in a future update.",
      },
    ],
  },
  {
    category: "Technician Help",
    items: [
      {
        q: "How do I list my services?",
        a: "After signing up as a technician, go to your Workspace → Services tab to add the services you offer.",
      },
      {
        q: "How do I accept bookings?",
        a: "New booking requests appear in your Workspace → Bookings tab. You can accept or decline each request.",
      },
      {
        q: "Can I update my availability?",
        a: "Yes. You can update your available time slots and working days from your profile settings.",
      },
    ],
  },
  {
    category: "Common Issues",
    items: [
      {
        q: "I didn't receive the OTP email.",
        a: 'Check your spam folder. If the email still hasn\'t arrived, use the "Resend OTP" button on the verification page.',
      },
      {
        q: "I forgot my password.",
        a: 'Use the "Forgot Password" link on the login page. An OTP will be sent to your registered email to reset it.',
      },
      {
        q: "My account was suspended.",
        a: "Accounts may be suspended for policy violations. Contact support at support@servicemate.local for assistance.",
      },
    ],
  },
];

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-slate-800 hover:text-primary"
        onClick={() => setOpen((prev) => !prev)}
      >
        {question}
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        )}
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-gray-600">{answer}</p>
      )}
    </div>
  );
}

export default function HelpCenterPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Help Center</h1>
        <p className="mt-2 leading-relaxed text-gray-600">
          Find answers to common questions or use the quick links below to get started.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/bookings/new")}>
            Go to Booking
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/technicians")}>
            Browse Technicians
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>

        <div className="mt-10 space-y-10">
          {helpSections.map(({ category, items }) => (
            <section key={category}>
              <h2 className="text-lg font-semibold text-slate-800">{category}</h2>
              <div className="mt-3 rounded-xl border border-slate-200 bg-white px-5">
                {items.map(({ q, a }) => (
                  <AccordionItem key={q} question={q} answer={a} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <StartupFooter />
    </PageWrapper>
  );
}
