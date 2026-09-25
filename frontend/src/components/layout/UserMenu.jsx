import {
  BookOpen,
  ChevronDown,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function UserMenu({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const goTo = (page) => {
    onNavigate?.(page);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Open account menu"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        className={`flex items-center gap-2 rounded-xl p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
          menuOpen ? "bg-[#EEF2FF]" : "hover:bg-[#F3F4F6]"
        }`}
      >
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#E5E7EB] bg-[#EEF2FF] text-[#4F46E5]"
          aria-hidden="true"
        >
          <span className="text-xs font-semibold">GR</span>
        </span>

        <span className="hidden min-w-20 gap-0.5 text-left sm:grid">
          <b className="truncate text-xs font-semibold text-[#111827]">
            Guest Reader
          </b>

          <small className="text-xs font-medium text-[#6B7280]">
            Welcome to Bookwise
          </small>
        </span>

        <ChevronDown
          size={13}
          strokeWidth={2}
          aria-hidden="true"
          className={`hidden text-[#6B7280] transition-transform sm:block ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-1.5 shadow-[0_14px_30px_rgba(17,24,39,0.08)]"
          role="menu"
        >
          <div className="mb-1 flex items-center gap-2.5 rounded-xl bg-[#F9FAFB] px-2.5 py-2.5">
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827]"
              aria-hidden="true"
            >
              GR
            </span>

            <span className="grid min-w-0 gap-0.5">
              <b className="truncate text-xs font-semibold text-[#111827]">
                Guest Reader
              </b>

              <small className="truncate text-xs font-medium text-[#6B7280]">
                Explore your library
              </small>
            </span>
          </div>

          <div className="my-1 h-px bg-[#E5E7EB]" />

          <button
            type="button"
            role="menuitem"
            onClick={() => goTo("library")}
            className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-medium text-[#4B5563] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#EEF2FF] text-[#4F46E5] group-hover:text-[#4F46E5]">
              <BookOpen size={14} />
            </span>

            My Library
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => goTo("settings")}
            className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-medium text-[#4B5563] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#EEF2FF] text-[#4F46E5] group-hover:text-[#4F46E5]">
              <Settings size={14} />
            </span>

            Settings
          </button>
        </div>
      )}
    </div>
  );
}