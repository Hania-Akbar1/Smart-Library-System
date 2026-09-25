import { ArrowRight } from "lucide-react";

export default function ViewDetails({
  onClick,
  label = "View Details",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-1.5 self-end rounded-md px-1 py-1 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
    >
      <span>{label}</span>

      <ArrowRight
        size={14}
        strokeWidth={2}
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </button>
  );
}