import { BookOpen } from "lucide-react";
import { useState } from "react";
import Availability from "./Availability";
import BookInfo from "./BookInfo";
import LevelBadge from "./LevelBadge";
import ViewDetails from "./ViewDetails";

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

function getCoverUrl(title) {
  const safeTitle = String(title || "Untitled book")
    .trim()
    .replace(/\s+/g, " ");

  return `https://picsum.photos/seed/${encodeURIComponent(safeTitle || "untitled-book")}/300/400`;
}

function getBookField(book, field) {
  if (book?.[field] !== undefined && book?.[field] !== null) {
    return book[field];
  }

  if (
    book?.book?.[field] !== undefined &&
    book?.book?.[field] !== null
  ) {
    return book.book[field];
  }

  if (
    book?.metadata?.[field] !== undefined &&
    book?.metadata?.[field] !== null
  ) {
    return book.metadata[field];
  }

  return null;
}

export default function BookCard({
  book = {},
  saved = false,
  onSave,
  onDetails,
}) {
  const title =
    getBookField(book, "title") ||
    getBookField(book, "name") ||
    "Untitled book";

  const author =
    getBookField(book, "author") ||
    getBookField(book, "authors") ||
    "Author unavailable";

  const level = getBookField(book, "level");

  const status =
    getBookField(book, "status") ||
    getBookField(book, "availability");

  const availability =
    getBookField(book, "availability") ||
    status;

  const tone =
    getBookField(book, "tone") || "blue";

  const normalizedBook = {
    ...book,
    title,
    author,
    level,
    status,
    availability,
    category: getBookField(book, "category"),
    rack: getBookField(book, "rack"),
    shelf: getBookField(book, "shelf"),
    tone,
  };

  const coverTone =
    coverTones[tone] || coverTones.blue;
  const [coverFailed, setCoverFailed] = useState(false);
  const coverUrl = getCoverUrl(title);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-[0_8px_20px_rgba(17,24,39,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D5DB] hover:shadow-[0_16px_30px_rgba(17,24,39,0.05)]">
      <div className="flex min-w-0 gap-3.5">
        <div
          className={`flex h-28 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-black/5 ${coverTone}`}
          role="img"
          aria-label={`${title} by ${author}`}
        >
          {!coverFailed ? (
            <img
              src={coverUrl}
              alt={`${title} cover`}
              className="h-full w-full rounded-lg object-cover shadow-sm"
              onError={() => setCoverFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-100 text-slate-300 shadow-sm">
              <BookOpen
                size={28}
                strokeWidth={1.5}
                className="opacity-80"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <BookInfo
            book={normalizedBook}
            saved={saved}
            onSave={onSave}
          />

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
            <LevelBadge level={level} />

            <Availability status={availability} />
          </div>
        </div>
      </div>

      <ViewDetails
        onClick={() => onDetails?.(normalizedBook)}
      />
    </article>
  );
}
