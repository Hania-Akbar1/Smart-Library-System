import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
  page,
  onNavigate,
  mobileOpen,
  onOpenMenu,
  onCloseMenu,
}) {
  const handleNavigate = (nextPage) => {
    onNavigate?.(nextPage);
    onCloseMenu?.();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-[#111827] antialiased">
      <Sidebar
        page={page}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
      />

      {mobileOpen && (
        <button
          type="button"
          onClick={onCloseMenu}
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-[#111827]/20 lg:hidden"
        >
          <span className="sr-only">Close navigation menu</span>
        </button>
      )}

      <div className="min-h-screen min-w-0 lg:pl-64">
        <Header
          page={page}
          onOpenMenu={onOpenMenu}
        />

        <main className="min-w-0">
          <div className="mx-auto w-full max-w-screen-2xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}