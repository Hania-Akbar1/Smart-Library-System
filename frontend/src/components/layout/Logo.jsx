export default function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F3F4F6] shadow-[0_0_0_1px_rgba(17,24,39,0.06)]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 40 40"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <rect x="6" y="9" width="11" height="22" rx="2.5" fill="#4F46E5" />
          <rect x="17" y="9" width="17" height="22" rx="2.5" fill="#14B8A6" />
          <path d="M17 15h9.5M17 20h9.5M17 25h9.5" stroke="#F8FAFC" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M9 13.5V27c2.2-1.4 4.8-2.1 7-2.1V11.4c-2 0-4.6.7-7 2.1Z" fill="#EEF2FF" opacity="0.95" />
          <rect x="20" y="13" width="11" height="2.5" rx="1.2" fill="#D1FAE5" />
          <rect x="20" y="20" width="9" height="2.5" rx="1.2" fill="#C7F9CC" />
        </svg>
      </span>

      <div className="min-w-0">
        <b className="block font-display text-base font-bold leading-none tracking-[-0.04em] text-[#111827]">
          Bookwise
        </b>

        <small className="mt-1 block truncate text-[11px] font-medium text-[#6B7280]">
          Learning, in your hands
        </small>
      </div>
    </div>
  );
}