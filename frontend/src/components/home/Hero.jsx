import Eyebrow from "./Eyebrow";
import HeroIllustration from "./HeroIllustration";
import LearningGoal from "./LearningGoal";

export default function Hero({
  query,
  onQueryChange,
  onSearch,
  conversation = [],
  chatLoading = false,
}) {
  return (
    <section className="flex flex-col gap-5 border-b border-[#E5E7EB] pb-6 pt-2 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pb-8">
      <div className="min-w-0 max-w-2xl flex-1">
        <Eyebrow />

        <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[0.96] tracking-[-0.06em] text-[#111827] sm:text-5xl lg:text-[4rem]">
          What do you{" "}
          <span className="text-[#4F46E5]">
            want to learn?
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-base leading-7 text-[#6B7280] sm:text-lg">
          Find the right books for your next skill,
          subject, or learning goal.
        </p>

        <div className="mt-5 max-w-xl">
          <LearningGoal
            value={query}
            onChange={onQueryChange}
            onSubmit={onSearch}
            conversation={conversation}
            loading={chatLoading}
            placeholder="Ask for a topic, skill, author, or learning goal..."
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#6B7280]">
          <span>Ask naturally and find relevant books</span>

          <span
            className="hidden h-1.5 w-1.5 rounded-full bg-[#D1D5DB] sm:block"
            aria-hidden="true"
          />

          <span>Topic • skill • author • goal</span>
        </div>
      </div>

      <div className="hidden shrink-0 lg:block">
        <HeroIllustration
          query={query}
          onQueryChange={onQueryChange}
          onSearch={onSearch}
        />
      </div>
    </section>
  );
}