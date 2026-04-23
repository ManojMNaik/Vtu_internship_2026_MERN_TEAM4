import { ShieldCheck, CalendarCheck, Users } from "lucide-react";
import { Github, Linkedin, Mail } from "lucide-react";
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

const team = [
  {
    name: "Manoj Mahabaleshwar Naik",
    email: "manojmnaiktn@gmail.com",
    linkedin: "https://www.linkedin.com/in/manoj-naik-21a5732a5",
    github: "https://github.com/ManojMNaik",
  },
  {
    name: "Sheikh Jawad Nasir Hussain",
    email: "sheikhjawad452@gmail.com",
    linkedin: "https://www.linkedin.com/in/sheikhjawad452/",
    github: "https://github.com/SheikhJawad452",
  },
  {
    name: "Mohammed Sarfraz",
    email: "sarfrazmohammed181@gmail.com",
    linkedin: "https://www.linkedin.com/in/mohammed-sarfraz-71842a26a/",
    github: "https://github.com/Sarfraz-03",
  },
  {
    name: "Gnana Sagar A M",
    email: "amsagar.pr@gmail.com",
    linkedin: "https://www.linkedin.com/in/gnana-sagar-a-m-420a24260/",
    github: "https://github.com/Sagar-A-M",
  },
  {
    name: "Nihal Shetty",
    email: "nihalnshetty24@gmail.com",
    linkedin: "https://www.linkedin.com/in/nihal-shetty-816490233/",
    github: "https://github.com/NihalShetty-coder",
  },
  {
    name: "Anusha K R",
    email: "anushakr1707@gmail.com",
    linkedin: "https://www.linkedin.com/in/anusha-kr17",
    github: "https://github.com/anushakr1707",
  },
  {
    name: "Rizan Mohammed",
    email: "rizanchichu33@gmail.com",
    linkedin: "https://www.linkedin.com/in/rizan-mohammed-155611369",
    github: "https://github.com/Rizanmohammed",
  },
  {
    name: "Chethan J M",
    email: "chethan112004@gmail.com",
    linkedin: "https://www.linkedin.com/in/chethan-j-m-4a5bba330",
    github: "https://github.com/ChethanJM",
  },
  {
    name: "Neha S",
    email: "snehas18062005@gmail.com",
    linkedin: "https://www.linkedin.com/in/neha-s-12a060345utm",
    github: "https://github.com/sneha-s-git",
  },
  {
    name: "Muhammad Kalandar Faizal",
    email: "muhammadkfaizal407@gmail.com",
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

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">Meet the Team</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              ServiceMate is built by a dedicated team of developers as part of the
              VTU Internship 2026 (MERN Stack — Team 4).
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.map(({ name, email, linkedin, github }) => (
                <div
                  key={email}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {name.charAt(0)}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-800">{name}</h3>
                  <div className="mt-auto flex items-center gap-3 pt-3">
                    <a
                      href={`mailto:${email}`}
                      className="text-slate-400 transition-colors hover:text-primary"
                      title={email}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                    {github && (
                      <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 transition-colors hover:text-primary"
                        title="GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {linkedin && (
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 transition-colors hover:text-primary"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
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
