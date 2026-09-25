import Logo from "./Logo";
import Navigation from "./Navigation";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar({
  page,
  onNavigate,
  mobileOpen,
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-[#E5E7EB] bg-white px-3 py-5 shadow-[0_0_0_1px_rgba(17,24,39,0.02),0_20px_35px_rgba(17,24,39,0.04)] transition-transform duration-200 ${
        mobileOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
      aria-label="Sidebar navigation"
    >
      <div className="shrink-0 px-2">
        <Logo />
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <Navigation
          page={page}
          onNavigate={onNavigate}
        />
      </div>

      <div className="mt-5 shrink-0 border-t border-[#E5E7EB] pt-4">
        <SidebarFooter />
      </div>
    </aside>
  );
}

