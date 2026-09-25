export default function LevelBadge({ level = "Advanced" }) {
  const levelStyles = {
    Beginner: "bg-[#EEF2FF] text-[#4F46E5]",
    Intermediate: "bg-[#EEF2FF] text-[#4338CA]",
    Advanced: "bg-[#E5E7EB] text-[#374151]",
  };

  const normalizedLevel =
    typeof level === "string" && level.trim()
      ? level.trim()
      : "Advanced";

  const style =
    levelStyles[normalizedLevel] || "bg-[#EEF2FF] text-[#4F46E5]";

  return (
    <span
      className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ${style}`}
    >
      {normalizedLevel}
    </span>
  );
}