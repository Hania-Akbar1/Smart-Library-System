import { MessageCircle, Send } from "lucide-react";

function renderMessageContent(content) {
  return String(content)
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      return <span key={index}>{part}</span>;
    });
}

export default function LearningGoal({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Ask about a book, topic, or skill...",
  conversation = [],
  loading = false,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedValue = value.trim();

    if (!trimmedValue || loading) {
      return;
    }

    onSubmit?.(event, trimmedValue);
  };

  return (
    <div className="w-full max-w-2xl">
      {(conversation.length > 0 || loading) && (
        <div
          className="mb-3 max-h-56 space-y-2 overflow-y-auto pr-1"
          aria-live="polite"
        >
          {conversation.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-line rounded-xl px-3.5 py-2.5 text-sm leading-5 ${
                  message.role === "user"
                    ? "bg-slate-800 text-white"
                    : "border border-slate-200 bg-white text-slate-600 shadow-sm"
                }`}
              >
                {renderMessageContent(message.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-400 shadow-sm">
                Finding relevant books...
              </div>
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex h-12 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pl-3.5 shadow-sm transition-colors focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-100"
      >
        <MessageCircle
          size={16}
          strokeWidth={1.9}
          className="shrink-0 text-slate-400"
          aria-hidden="true"
        />

        <input
          type="search"
          value={value}
          onChange={(event) =>
            onChange?.(event.target.value)
          }
          placeholder={placeholder}
          aria-label="Search or ask about books"
          autoComplete="off"
          disabled={loading}
          className="min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="submit"
          aria-label="Send"
          disabled={!value.trim() || loading}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-800 text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Send
            size={15}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  );
}