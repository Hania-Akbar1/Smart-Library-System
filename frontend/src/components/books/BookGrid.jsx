import BookCard from "./BookCard";

function BookSkeleton() {
  return (
    <article
      className="animate-pulse overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-[0_8px_20px_rgba(17,24,39,0.03)]"
      aria-hidden="true"
    >
      <div className="flex gap-3.5">
        <div className="h-28 w-20 shrink-0 rounded-xl bg-slate-200" />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-4 w-4/5 rounded bg-slate-200" />

          <div className="mt-2 h-3 w-3/5 rounded bg-slate-100" />

          <div className="mt-3 flex gap-2">
            <div className="h-5 w-14 rounded-full bg-slate-100" />
            <div className="h-5 w-16 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="h-9 rounded-lg bg-slate-100" />
          <div className="h-9 rounded-lg bg-slate-100" />
          <div className="h-9 rounded-lg bg-slate-100" />
        </div>
      </div>

      <div className="mt-3 h-9 rounded-xl bg-slate-100" />
    </article>
  );
}

export default function BookGrid({
  books = [],
  saved = [],
  onSave,
  onDetails,
  loading = false,
}) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        aria-busy="true"
        aria-label="Loading books"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <BookSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!books.length) {
    return (
      <div
        className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white px-6 py-10 text-center shadow-[0_8px_20px_rgba(17,24,39,0.02)]"
        role="status"
      >
        <div className="mx-auto max-w-sm">
          <h3 className="font-display text-base font-bold text-[#111827]">
            No books found
          </h3>

          <p className="mt-1.5 text-sm leading-5 text-[#6B7280]">
            Try a different topic, skill, or author.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {books.map((book) => (
        <BookCard
          key={book.id ?? book.title}
          book={book}
          saved={saved.some(
            (savedId) =>
              String(savedId) === String(book.id)
          )}
          onSave={onSave}
          onDetails={onDetails}
        />
      ))}
    </div>
  );
}