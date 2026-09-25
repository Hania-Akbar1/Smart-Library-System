import {
  Bookmark,
  Clock3,
  Home,
  Settings,
} from "lucide-react";

const navigation = [
  ["home", "Home", Home],
  ["saved", "Saved Books", Bookmark],
  ["history", "Search History", Clock3],
  ["settings", "Settings", Settings],
];

export default function Navigation({
  page,
  onNavigate,
}) {
  return (
    <nav
      aria-label="Primary navigation"
      className="mt-6"
    >
      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
        Your Space
      </p>

      <div className="grid gap-1.5">
        {navigation.map(
          ([id, label, Icon]) => {
            const isActive = page === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={
                  isActive ? "page" : undefined
                }
                className={`group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
                  isActive
                    ? "bg-[#EEF2FF] font-semibold text-[#111827] shadow-sm"
                    : "font-medium text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
                }`}
              >
                <span
                  className={`absolute left-0 h-5 w-1 rounded-full ${
                    isActive
                      ? "bg-[#4F46E5]"
                      : "bg-transparent"
                  }`}
                  aria-hidden="true"
                />

                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    isActive
                      ? "bg-white text-[#4F46E5] shadow-sm ring-1 ring-[#E5E7EB]"
                      : "text-[#6B7280] group-hover:text-[#111827]"
                  }`}
                >
                  <Icon
                    size={15}
                    strokeWidth={
                      isActive ? 2.1 : 1.8
                    }
                    aria-hidden="true"
                  />
                </span>

                <span className="truncate">
                  {label}
                </span>
              </button>
            );
          }
        )}
      </div>
    </nav>
  );
}