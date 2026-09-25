import { Bookmark } from "lucide-react";

export default function BookInfo({
  book = {},
  saved = false,
  onSave,
}) {
  const title = book.title || book.name || "Untitled book";
  const author = book.author || "Author unavailable";
  const category = book.category;

  return (
    <div className="min-w-0">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-display text-[1rem] font-bold leading-5 text-[#111827]">
            {title}
          </h3>

          <p className="mt-1 truncate text-xs font-medium text-[#6B7280]">
            {author}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSave?.(book.id)}
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
            saved
              ? "bg-[#EEF2FF] text-[#4F46E5]"
              : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
          }`}
          aria-label={`${saved ? "Remove" : "Save"} ${title}`}
          aria-pressed={saved}
        >
          <Bookmark
            size={16}
            strokeWidth={1.8}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>

      {category && (
        <span className="mt-2 inline-flex max-w-full truncate rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5]">
          {category}
        </span>
      )}
    </div>
  );
}