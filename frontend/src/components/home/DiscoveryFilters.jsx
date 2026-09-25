import { Filter, RotateCcw } from "lucide-react";

export default function DiscoveryFilters({
  filters,
  options,
  onChange,
  onReset,
}) {
  const activeCount = Object.values(filters).filter(
    (value) => value !== "all"
  ).length;

  return (
    <fieldset
      className="mb-5 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-[0_10px_24px_rgba(17,24,39,0.03)] sm:p-4"
      aria-label="Book filters"
    >
      <legend className="sr-only">Book filters</legend>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
            <Filter
              size={15}
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#111827]">
                Filter books
              </span>

              {activeCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4F46E5] px-1.5 text-[11px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs text-[#6B7280]">
              Narrow results by your preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:items-center">
          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="px-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
              Level
            </span>

            <select
              value={filters.level}
              onChange={(event) =>
                onChange(
                  "level",
                  event.target.value
                )
              }
              className="h-10 w-full min-w-0 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 text-xs font-medium text-[#111827] outline-none transition-colors hover:border-[#D1D5DB] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">
                All levels
              </option>

              {options.levels.map((level) => (
                <option
                  key={level}
                  value={level}
                >
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="px-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
              Category
            </span>

            <select
              value={filters.category}
              onChange={(event) =>
                onChange(
                  "category",
                  event.target.value
                )
              }
              className="h-10 w-full min-w-0 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 text-xs font-medium text-[#111827] outline-none transition-colors hover:border-[#D1D5DB] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">
                All categories
              </option>

              {options.categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="px-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
              Availability
            </span>

            <select
              value={filters.availability}
              onChange={(event) =>
                onChange(
                  "availability",
                  event.target.value
                )
              }
              className="h-10 w-full min-w-0 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 text-xs font-medium text-[#111827] outline-none transition-colors hover:border-[#D1D5DB] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">
                Any status
              </option>

              {options.availability.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1)}
                  </option>
                )
              )}
            </select>
          </label>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="mt-auto inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 text-xs font-semibold text-[#4B5563] transition-colors hover:border-[#D1D5DB] hover:bg-white hover:text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <RotateCcw
                size={13}
                strokeWidth={2}
                aria-hidden="true"
              />
              Reset
            </button>
          )}
        </div>
      </div>
    </fieldset>
  );
}