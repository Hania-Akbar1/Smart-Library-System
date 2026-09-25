import { Search, X } from "lucide-react";

export default function GlobalSearch({
  query,
  onQueryChange,
  onSearch,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(event);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="group flex h-12 w-full max-w-md items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-3.5 text-[#6B7280] shadow-[0_8px_22px_rgba(17,24,39,0.04)] transition-all duration-200 focus-within:border-[#4F46E5] focus-within:shadow-[0_10px_28px_rgba(79,70,229,0.12)] sm:w-[22rem]"
    >
      <Search
        size={16}
        strokeWidth={1.9}
        className="shrink-0 text-[#6B7280] transition-colors group-focus-within:text-[#4F46E5]"
        aria-hidden="true"
      />

      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange?.(event.target.value)}
        placeholder="Search books, topics, or authors..."
        aria-label="Search books, topics, or authors"
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#111827] outline-none placeholder:text-[#6B7280]"
      />

      {query && (
        <button
          type="button"
          onClick={() => onQueryChange?.("")}
          aria-label="Clear search"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <X size={13} strokeWidth={2} />
        </button>
      )}
    </form>
  );
}