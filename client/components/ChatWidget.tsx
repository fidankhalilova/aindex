"use client";

import { useState } from "react";

type BillingTab = "monthly" | "annual";

const FEATURES = [
  {
    label: "AI chatbot access",
    desc: "Unlimited conversations",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    ),
  },
  {
    label: "Priority responses",
    desc: "Faster, smarter replies",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9z" />
      </svg>
    ),
  },
  {
    label: "Compare +3 AI tools",
    desc: "More options, better choices",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Image & file uploads",
    desc: "Attach files to tools you submit",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Personalized Dashboard",
    desc: "Personalize your experience with more detailed analytics and insights",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [billing, setBilling] = useState<BillingTab>("monthly");

  const price = billing === "annual" ? "$34.99" : "$3.49";

  return (
    <>
      {/* Subscription Plan Modal */}
      {open && (
        <div className="fixed bottom-22.5 right-6 w-100 bg-white rounded-2xl shadow-2xl border border-gray-100 z-1000 overflow-hidden font-sans">
          {/* Header */}
          <div className="px-6 pt-6">
            <div className="flex items-start justify-between">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 bg-blue-50 rounded-lg px-2.5 py-1 mb-2.5">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span className="text-xs text-blue-500 font-semibold">
                    Pro plan
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Unlock the full experience
                </h2>
                <p className="text-[13px] text-gray-500">
                  Get AI chat access and more powerful features
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-3 shrink-0 transition-colors cursor-pointer bg-transparent border-none"
              >
                ×
              </button>
            </div>

            {/* Billing toggle */}
            <div className="flex gap-2 mt-5">
              {(["monthly", "annual"] as BillingTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBilling(tab)}
                  className={`flex-1 py-2 px-3 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                    billing === tab
                      ? "border-indigo-400 bg-indigo-50 text-indigo-600 font-semibold"
                      : "border-gray-200 bg-gray-50 text-gray-500 font-medium hover:bg-gray-100"
                  }`}
                >
                  {tab === "monthly" ? "Monthly" : "Annual"}
                  {tab === "annual" && (
                    <span className="bg-green-100 text-green-700 rounded text-[11px] font-semibold px-1.5 py-0.5">
                      Save 20%
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-4xl font-bold text-gray-900">{price}</span>
              <span className="text-sm text-gray-500">/ month</span>
              {billing === "annual" && (
                <span className="text-xs text-gray-400 ml-1.5">
                  billed $180/yr
                </span>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="px-6 py-4">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              What&apos;s included
            </div>
            <div className="flex flex-col gap-2">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="flex items-start gap-3 px-3 py-2.5 bg-gray-50 rounded-xl"
                >
                  <div className="w-7.5 h-7.5 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-gray-800">
                      {f.label}
                    </div>
                    <div className="text-[12px] text-gray-500">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 pb-6 flex flex-col gap-2">
            <button className="w-full py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-[0.98] text-white text-[15px] font-semibold transition-all tracking-wide shadow-md shadow-indigo-200 cursor-pointer border-none">
              Get started with Pro →
            </button>
            <p className="text-[12px] text-gray-400 text-center">
              Cancel anytime · No hidden fees
            </p>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 hover:scale-110 active:scale-95 border-none cursor-pointer z-1001 flex items-center justify-center shadow-lg shadow-indigo-300 transition-transform duration-200"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </button>
    </>
  );
}
