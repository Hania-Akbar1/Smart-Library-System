import { useState } from "react";

const featuredTopics = [
  "Python",
  "Web Development",
  "Data Science",
  "AI & Machine Learning",
  "UX Design",
  "Cybersecurity",
];

export default function HeroIllustration({
  query,
  onQueryChange,
  onSearch,
}) {
  const [open, setOpen] = useState(false);

  const handleTopicSelect = (topic) => {
    onQueryChange?.(topic);
    onSearch?.(undefined, topic);
    setOpen(false);
  };

  return (
    <>
      <div
        className="relative hidden w-[18rem] shrink-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_14px_28px_rgba(17,24,39,0.05)] lg:block"
        aria-hidden="true"
      >
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#EEF2FF]" />
        <div className="absolute -bottom-9 -left-6 h-24 w-24 rounded-full bg-[#ECFEFF]" />

        <div className="relative z-10">
          <div className="mb-3 flex items-center justify-between">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18h6" />
                <path d="M10.5 18V9.8a2.5 2.5 0 0 1 3-2.4 2.5 2.5 0 0 1 1.5 2.4V18" />
                <path d="M9 14.3c-.9-1.2-1.7-1.8-2.8-1.8A3.2 3.2 0 0 0 3 15.7v1.8h6.2" />
                <path d="M15 14.3c.9-1.2 1.7-1.8 2.8-1.8A3.2 3.2 0 0 1 21 15.7v1.8h-6.2" />
              </svg>
            </span>

            <span className="rounded-full border border-[#D1FAE5] bg-[#ECFDF5] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#10B981]">
              Insight
            </span>
          </div>

          <div className="mb-3">
            <h3 className="font-display text-lg font-bold leading-tight tracking-[-0.04em] text-[#111827]">
              Learn something
              <span className="text-[#4F46E5]"> worth knowing</span>
            </h3>
            <p className="mt-1 text-[11px] leading-5 text-[#6B7280]">
              Small steps every day build lasting skills.
            </p>
          </div>

          <div className="mb-4 flex items-end justify-between gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
            <div className="flex items-end gap-2">
              <div className="h-8 w-3 rounded-t-md bg-[#C7D2FE]" />
              <div className="h-12 w-3 rounded-t-md bg-[#818CF8]" />
              <div className="h-10 w-3 rounded-t-md bg-[#10B981]" />
              <div className="h-14 w-3 rounded-t-md bg-[#14B8A6]" />
              <div className="h-16 w-3 rounded-t-md bg-[#4F46E5]" />
            </div>

            <div className="flex flex-col items-end gap-1 text-right">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Growth</span>
              <span className="font-display text-lg font-bold text-[#111827]">+28%</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-xl bg-[#4F46E5] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            Explore Topics
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-[1px]">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_40px_rgba(17,24,39,0.12)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4F46E5]">
                  Popular topics
                </p>
                <h3 className="mt-1 font-display text-xl font-bold tracking-[-0.04em] text-[#111827]">
                  Browse learning paths
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close topic picker"
                className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-2 py-1 text-sm text-[#6B7280] transition-colors hover:text-[#111827]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {featuredTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicSelect(topic)}
                  className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-left text-sm font-medium text-[#374151] transition-colors hover:border-[#C7D2FE] hover:bg-[#EEF2FF] hover:text-[#111827]"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}