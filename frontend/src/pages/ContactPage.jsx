import { useState } from "react";
import { Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/layout/PageWrapper";
import StartupFooter from "@/components/home/StartupFooter";

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@servicemate.local" },
  { icon: MapPin, label: "Location", value: "Bengaluru, Karnataka, India" },
  { icon: Clock, label: "Support Hours", value: "Mon – Sat, 9 AM – 6 PM IST" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Contact Us</h1>
        <p className="mt-2 leading-relaxed text-gray-600">
          Have a question or feedback? Reach out and we'll get back to you as soon as
          possible.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact details */}
          <div className="space-y-6">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-sm text-gray-600">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  Message Received
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Thank you for reaching out. We'll respond within 24 hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => {
                    setForm({ name: "", email: "", message: "" });
                    setSubmitted(false);
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="How can we help?"
                  />
                </div>
                <Button type="submit" variant="accent" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <StartupFooter />
    </PageWrapper>
  );
}
