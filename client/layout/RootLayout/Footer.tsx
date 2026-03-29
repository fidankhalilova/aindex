import Link from "next/link";
import { Camera, Bird, Phone, Mail } from "lucide-react";

const LINKS = {
  Platform: [
    { href: "/tools", label: "Browse Tools" },
    { href: "/tools/submit", label: "Submit a Tool" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  Categories: [
    { href: "/tools?category=text-generation", label: "Text Generation" },
    { href: "/tools?category=image-generation", label: "Image Generation" },
    { href: "/tools?category=coding", label: "Coding" },
    { href: "/tools?category=productivity", label: "Productivity" },
    { href: "/tools?category=data-analysis", label: "Data Analysis" },
  ],
  Company: [
    { href: "/about", label: "Our Team" },
    { href: "/contact", label: "Get in Touch" },
  ],
};

const SOCIAL = [
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Bird, href: "#", label: "Twitter" },
  { icon: Phone, href: "#", label: "Phone" },
  { icon: Mail, href: "mailto:hello@aindex.ai", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#1B1464] text-white overflow-hidden">
      {/* Top wave */}
      <div
        className="absolute top-0 inset-x-0 overflow-hidden"
        style={{ height: 60, marginTop: -1 }}
      >
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0 30C240 6 480 54 720 30C960 6 1200 54 1440 30V60H0V30Z"
            fill="#F8F9FF"
          />
        </svg>
      </div>
      {/* Wave decoration */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[.05] pointer-events-none"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0 200C240 120 480 280 720 200C960 120 1200 280 1440 200"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M0 250C240 170 480 330 720 250C960 170 1200 330 1440 250"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0 150C240 70 480 230 720 150C960 70 1200 230 1440 150"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#4A6DE0] to-[#00C2CB] flex items-center justify-center shadow-[0_0_28px_rgba(0,194,203,.4)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" fill="white" />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 6v2M12 16v2M6 12H4M20 12h-2"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-display font-bold text-xl">AIndex</span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-xs">
              Your centralized platform for discovering, exploring, and
              comparing AI tools. Find the perfect tool for any task.
            </p>
            <div className="flex items-center gap-2.5">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-xs mb-4 text-white/80 uppercase tracking-widest">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-sm">
            © {new Date().getFullYear()} AIndex — Built by Nizami Hajiyev, Murad
            Safarli, Fidan Khalilova, Ismayil Aliyev &amp; Ali Ismayilov.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-white/35 hover:text-white text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-white/35 hover:text-white text-sm transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
