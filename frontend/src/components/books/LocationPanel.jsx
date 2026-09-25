import { ChevronRight, MapPin } from "lucide-react";

export default function LocationPanel({ location = {}, shelf, onClick }) {
  const currentShelf = location.shelf || shelf;
  const section = location.section;
  const rack = location.rack;
  const name = location.name || "Location unavailable";

  const hasLocationDetails = section && rack && currentShelf;

  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-teal-700">
        <MapPin size={15} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <strong className="block truncate text-xs font-bold text-slate-700">
          {name}
        </strong>

        <small className="mt-0.5 block text-xs leading-4 text-slate-500">
          {hasLocationDetails ? (
            <>
              Section {section}
              <span className="mx-1">•</span>
              Rack {rack}
              <span className="mx-1">•</span>
              Shelf {currentShelf}
            </>
          ) : (
            "Ask the library team for a current location"
          )}
        </small>
      </span>

      {onClick && (
        <ChevronRight
          size={16}
          className="shrink-0 text-slate-400"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-xl border border-teal-100 bg-teal-50 p-3 text-left transition-colors hover:border-teal-200 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-200"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-teal-100 bg-teal-50 p-3">
      {content}
    </div>
  );
}