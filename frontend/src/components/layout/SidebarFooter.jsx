import { BookOpen, Sparkles } from "lucide-react";

export default function SidebarFooter() {
  return (
    <div className="mt-auto rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 shadow-sm">
      <div className="mb-2.5 flex items-center gap-1.5" aria-hidden="true">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
          <BookOpen size={14} strokeWidth={2} />
        </span>

        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E0E7FF] text-[#4F46E5]">
          <Sparkles size={11} strokeWidth={2} />
        </span>

        <span className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      <p className="text-xs leading-5 text-[#6B7280]">
        Make room for{" "}
        <span className="font-semibold text-[#111827]">
          better questions.
        </span>
      </p>

      <div className="mt-2 flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]"
          aria-hidden="true"
        />

        <small className="text-[11px] font-medium text-[#6B7280]">
          Curated for curious minds
        </small>
      </div>
    </div>
  );
}
