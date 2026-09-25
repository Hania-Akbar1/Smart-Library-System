import { BookOpen, X } from "lucide-react";
import { useEffect, useRef } from "react";
import Availability from "./Availability";
import LevelBadge from "./LevelBadge";
import Metadata from "./Metadata";

const coverTones = {
  blue: "bg-slate-800 text-white",
  slate: "bg-slate-600 text-white",
  sand: "bg-stone-700 text-white",
  green: "bg-emerald-800 text-white",
  gold: "bg-amber-700 text-white",
  coral: "bg-orange-800 text-white",
  violet: "bg-indigo-800 text-white",
  navy: "bg-slate-900 text-white",
  orange: "bg-orange-700 text-white",
};

export default function BookDetails({ book, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!book) return undefined;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [book, onClose]);

  if (!book) return null;

  const title = book.title || "Untitled book";
  const author = book.author || "Author unavailable";
  const coverTone = coverTones[book.tone] || coverTones.blue;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-screen w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
          aria-label="Close book details"
        >
          <X size={17} strokeWidth={2} />
        </button>

        <div className="mb-5 flex items-start gap-3.5 pr-8">
          <div
            className={`relative flex h-32 w-20 shrink-0 flex-col justify-between overflow-hidden rounded-md p-2.5 shadow-sm ${coverTone}`}
            role="img"
            aria-label={`${title} by ${author}`}
          >
            <span
              className="absolute left-0 top-0 h-full w-1 bg-black/15"
              aria-hidden="true"
            />

            <div className="relative">
              <BookOpen
                size={15}
                strokeWidth={1.8}
                className="mb-2 opacity-75"
                aria-hidden="true"
              />

              <strong className="block font-display text-xs font-bold leading-tight">
                {book.cover || title}
              </strong>
            </div>

            <small className="relative truncate text-xs font-medium opacity-75">
              {author}
            </small>
          </div>

          <div className="min-w-0 pt-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Book Details
            </p>

            <h2
              id="book-details-title"
              className="mt-1.5 font-display text-xl font-bold leading-tight text-slate-800"
            >
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              by {author}
            </p>
          </div>
        </div>

        {book.description && (
          <div className="mb-4 rounded-lg bg-slate-50 p-3.5">
            <p className="text-sm leading-5 text-slate-600">
              {book.description}
            </p>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <LevelBadge level={book.level} />

          <Availability
            status={book.status || book.availability}
          />
        </div>

        <div className="border-t border-slate-200 pt-4">
          <Metadata book={book} />
        </div>

       

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}