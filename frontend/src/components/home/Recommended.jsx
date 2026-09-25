import BookGrid from "../books/BookGrid";
import DiscoveryFilters from "./DiscoveryFilters";

function BookSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
          <div className="h-40 bg-slate-100" />

          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-8 w-24 rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Recommended({
  books = [],
  saved = [],
  onSave,
  onDetails,
  filters,
  options,
  onFilterChange,
  onResetFilters,
  loading = false,
}) {
  return (
    <section
      className="mt-7"
      aria-labelledby="recommended-books-heading"
    >
      <div className="mb-4">
        <h2
          id="recommended-books-heading"
          className="font-display text-2xl font-bold leading-tight tracking-[-0.04em] text-[#111827]"
        >
          Recommended Books
        </h2>

        <p className="mt-1 text-sm leading-6 text-[#6B7280]">
          Based on your learning goal
        </p>
      </div>

      {filters && options && (
        <DiscoveryFilters
          filters={filters}
          options={options}
          onChange={onFilterChange}
          onReset={onResetFilters}
        />
      )}

      {loading ? (
        <BookSkeleton />
      ) : (
        <BookGrid
          books={books}
          saved={saved}
          onSave={onSave}
          onDetails={onDetails}
        />
      )}
    </section>
  );
}