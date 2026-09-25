import {
  Archive,
  BookOpen,
  CalendarDays,
  Globe2,
  Library,
} from "lucide-react";

export default function Metadata({ book = {}, shelf }) {
  const items = [
    {
      label: "Section",
      value: book.section,
      icon: BookOpen,
    },
    {
      label: "Rack",
      value: book.rack,
      icon: Archive,
    },
    {
      label: "Shelf",
      value: book.shelf || shelf,
      icon: Library,
    },
    {
      label: "Pages",
      value: book.pages,
      icon: BookOpen,
    },
    {
      label: "Published",
      value: book.year,
      icon: CalendarDays,
    },
    {
      label: "Language",
      value: book.language,
      icon: Globe2,
    },
    {
      label: "Category",
      value: book.category,
      icon: Library,
    },
    {
      label: "ISBN",
      value: book.isbn,
      icon: BookOpen,
    },
  ].filter(
    ({ value }) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );

  if (!items.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
        >
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Icon
              size={14}
              strokeWidth={1.8}
              className="shrink-0 text-slate-500"
              aria-hidden="true"
            />

            <span className="truncate">{label}</span>
          </div>

          <p
            className="mt-1 truncate text-sm font-semibold text-slate-700"
            title={String(value)}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}