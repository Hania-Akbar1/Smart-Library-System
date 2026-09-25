const STATUS_CONFIG = {
  available: {
    label: "Available",
    text: "text-[#059669]",
    dot: "bg-[#059669]",
    chip: "bg-[#ECFDF5] border border-[#A7F3D0]",
  },
  borrowed: {
    label: "Borrowed",
    text: "text-[#B45309]",
    dot: "bg-[#F59E0B]",
    chip: "bg-[#FFFBEB] border border-[#FDE68A]",
  },
  reserved: {
    label: "Reserved",
    text: "text-[#4F46E5]",
    dot: "bg-[#4F46E5]",
    chip: "bg-[#EEF2FF] border border-[#C7D2FE]",
  },
  unavailable: {
    label: "Not Available",
    text: "text-[#DC2626]",
    dot: "bg-[#DC2626]",
    chip: "bg-[#FEF2F2] border border-[#FECACA]",
  },
};

export default function Availability({
  status = "available",
  available,
}) {
  const statusText = String(status).trim().toLowerCase();
  const normalizedStatus =
    typeof available === "boolean"
      ? available
        ? "available"
        : "unavailable"
      : ["yes", "true", "1"].includes(statusText)
        ? "available"
        : ["no", "false", "0"].includes(statusText)
          ? "unavailable"
          : statusText;

  const config =
    STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.available;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold ${config.text} ${config.chip}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.dot}`}
        aria-hidden="true"
      />

      {config.label}
    </span>
  );
}