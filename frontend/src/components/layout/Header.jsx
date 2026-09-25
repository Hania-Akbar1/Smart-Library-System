import { Menu, BookOpen } from "lucide-react";

const pageContext = {
  home: ["Discover", "Find something worth learning today"],
  history: ["Search History", "Pick up where your curiosity left off"],
  settings: ["Settings", "Make Bookwise work for you"],
};

export default function Header({ page, onOpenMenu }) {
  const [eyebrow, title] = pageContext[page] || pageContext.home;

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-[#E5E7EB] bg-white/90 px-4 backdrop-blur-md sm:px-7 lg:px-10">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation menu"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E5E7EB] bg-white text-[#4B5563] transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-indigo-100 lg:hidden"
      >
        <Menu size={19} strokeWidth={2} />
      </button>

      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-[#111827]">
          {eyebrow}
        </span>

        <p className="mt-0.5 hidden truncate text-xs text-[#6B7280] sm:block">
          {title}
        </p>
      </div>

      <div className="hidden items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 shadow-sm sm:flex">
        <BookOpen
          size={14}
          strokeWidth={1.9}
          className="text-[#4F46E5]"
        />

        <span className="text-xs font-semibold text-[#111827]">
          Smart Library
        </span>
      </div>
    </header>
  );
}