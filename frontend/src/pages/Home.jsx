import Hero from "../components/home/Hero";
import Recommended from "../components/home/Recommended";

export default function Home({
  query,
  onQueryChange,
  onSearch,
  conversation = [],
  chatLoading = false,
  books,
  saved,
  onSave,
  onDetails,
  filters,
  options,
  onFilterChange,
  onResetFilters,
  loading,
  searched = "",
  showBookResults = false,
}) {
  const shouldShowBooks = !searched || showBookResults;

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <Hero
        query={query}
        onQueryChange={onQueryChange}
        onSearch={onSearch}
        conversation={conversation}
        chatLoading={chatLoading}
      />

      {shouldShowBooks && (
        <Recommended
          books={books}
          saved={saved}
          onSave={onSave}
          onDetails={onDetails}
          filters={filters}
          options={options}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          loading={loading}
        />
      )}
    </main>
  );
}