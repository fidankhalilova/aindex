"use client";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Check,
  Camera,
  Bird,
  Phone,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@AINavix.ai",
    href: "mailto:hello@AINavix.ai",
  },
  { icon: MapPin, label: "Location", value: "Baku, Azerbaijan", href: null },
  { icon: Clock, label: "Response", value: "Within 24 hours", href: null },
];

const SOCIAL = [
  { icon: Camera, href: "https://github.com/AINavix", label: "Instagram" },
  { icon: Bird, href: "https://twitter.com/AINavix", label: "Twitter" },
  { icon: Phone, href: "tel:+1234567890", label: "Phone" },
];

const SUBJECTS = [
  "General Inquiry",
  "Report a Tool",
  "Submit a Partnership",
  "Bug Report",
  "Feature Request",
  "Press & Media",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 20)
      e.message = "Please write at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);

    // Here you would typically send to your backend API
    // For now, we'll simulate sending
    try {
      // TODO: Replace with actual API call when you have a contact endpoint
      // await contactApi.sendMessage(form);
      await new Promise((r) => setTimeout(r, 1500));
      setSent(true);
      toast.success("Message sent! We'll be in touch soon.");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] pt-16">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-[#1B1464] via-[#2E4BC6] to-[#4A8FD4] overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          viewBox="0 0 1440 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0 150C360 90 720 210 1080 150C1260 120 1380 165 1440 150"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 180C360 120 720 240 1080 180C1260 150 1380 195 1440 180"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <div className="absolute top-1/4 right-1/4 w-56 h-56 rounded-full bg-[#00C2CB]/15 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
            <MessageSquare size={14} /> Get in Touch
          </span>
          <h1 className="font-display font-bold text-white text-4xl md:text-5xl mb-4">
            Contact Us
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto">
            Have a question, spotted an issue, or want to partner with us? We'd
            love to hear from you.
          </p>
        </div>
        <div className="absolute bottom-0 inset-x-0">
          <svg
            viewBox="0 0 1440 55"
            preserveAspectRatio="none"
            className="w-full block"
            style={{ height: 55 }}
          >
            <path
              d="M0 28C360 8 720 48 1080 28C1260 18 1380 38 1440 28V55H0V28Z"
              fill="#F8F9FF"
            />
          </svg>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact info cards */}
              {INFO.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-[#E8EAFF] shadow-[0_4px_24px_rgba(27,20,100,.06)] p-5 flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#E8EAFF] to-[#F8F9FF] border border-[#E8EAFF] flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#2E4BC6]" />
                  </div>
                  <div>
                    <div className="text-[#1B1464]/45 text-xs font-semibold uppercase tracking-wider mb-0.5">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="text-[#1B1464] text-sm font-semibold hover:text-[#2E4BC6] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-[#1B1464] text-sm font-semibold">
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="bg-white rounded-2xl border border-[#E8EAFF] shadow-[0_4px_24px_rgba(27,20,100,.06)] p-5">
                <h3 className="font-semibold text-[#1B1464] text-sm mb-4">
                  Follow Us
                </h3>
                <div className="flex items-center gap-3">
                  {SOCIAL.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-xl bg-[#F8F9FF] border border-[#E8EAFF] flex items-center justify-center text-[#2E4BC6] hover:bg-linear-to-br hover:from-[#2E4BC6] hover:to-[#00C2CB] hover:text-white hover:border-transparent transition-all duration-200"
                    >
                      <Icon size={17} />
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ hint */}
              <div className="bg-linear-to-br from-[#1B1464] to-[#2E4BC6] rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#00C2CB]/20 blur-2xl pointer-events-none" />
                <div className="relative">
                  <h3 className="font-display font-bold text-white text-base mb-2">
                    Want to list your tool?
                  </h3>
                  <p className="text-white/60 text-sm mb-4 leading-relaxed">
                    Submit your AI tool for free and get discovered by thousands
                    of users.
                  </p>
                  <Link
                    href="/tools/submit"
                    className="inline-flex items-center gap-1.5 bg-white text-[#2E4BC6] text-sm font-bold px-4 py-2.5 rounded-xl shadow-md hover:-translate-y-px transition-all duration-200"
                  >
                    Submit a Tool →
                  </Link>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="bg-white rounded-2xl border border-[#E8EAFF] shadow-[0_4px_24px_rgba(27,20,100,.07)] p-12 text-center h-full flex flex-col items-center justify-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#2E4BC6] to-[#00C2CB] flex items-center justify-center shadow-[0_0_30px_rgba(0,194,203,.4)] mx-auto">
                    <Check size={36} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#1B1464] text-2xl mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-[#1B1464]/55 text-base">
                      Thank you for reaching out,{" "}
                      <strong className="text-[#1B1464]">{form.name}</strong>.
                      We'll reply within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: SUBJECTS[0],
                        message: "",
                      });
                    }}
                    className="text-[#2E4BC6] text-sm font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#E8EAFF] shadow-[0_4px_24px_rgba(27,20,100,.07)] p-7">
                  <h2 className="font-display font-bold text-[#1B1464] text-xl mb-6">
                    Send a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1B1464]/60 uppercase tracking-wider mb-1.5">
                          Your Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                          placeholder="Jane Doe"
                          className={`w-full px-4 py-3 bg-[#F8F9FF] border rounded-xl text-sm text-[#1B1464] placeholder-[#1B1464]/30 focus:outline-none focus:ring-2 transition-all ${errors.name ? "border-red-400 focus:ring-red-100" : "border-[#E8EAFF] focus:border-[#2E4BC6] focus:ring-[#2E4BC6]/10"}`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1B1464]/60 uppercase tracking-wider mb-1.5">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="jane@example.com"
                          className={`w-full px-4 py-3 bg-[#F8F9FF] border rounded-xl text-sm text-[#1B1464] placeholder-[#1B1464]/30 focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-400 focus:ring-red-100" : "border-[#E8EAFF] focus:border-[#2E4BC6] focus:ring-[#2E4BC6]/10"}`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1B1464]/60 uppercase tracking-wider mb-1.5">
                        Subject
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => set("subject", e.target.value)}
                        className="w-full px-4 py-3 bg-[#F8F9FF] border border-[#E8EAFF] rounded-xl text-sm text-[#1B1464] focus:outline-none focus:border-[#2E4BC6] cursor-pointer"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1B1464]/60 uppercase tracking-wider mb-1.5">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        rows={6}
                        placeholder="Tell us what's on your mind..."
                        className={`w-full px-4 py-3 bg-[#F8F9FF] border rounded-xl text-sm text-[#1B1464] placeholder-[#1B1464]/30 focus:outline-none focus:ring-2 transition-all resize-none ${errors.message ? "border-red-400 focus:ring-red-100" : "border-[#E8EAFF] focus:border-[#2E4BC6] focus:ring-[#2E4BC6]/10"}`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.message ? (
                          <p className="text-red-500 text-xs">
                            {errors.message}
                          </p>
                        ) : (
                          <span />
                        )}
                        <span
                          className={`text-xs ${form.message.length > 1000 ? "text-red-400" : "text-[#1B1464]/30"}`}
                        >
                          {form.message.length}/1000
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(46,75,198,.3)] hover:shadow-[0_0_30px_rgba(0,194,203,.45)] hover:-translate-y-px transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {sending ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />{" "}
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
