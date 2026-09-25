import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import DashboardLayout from "./components/layout/DashboardLayout";
import BookDetails from "./components/books/BookDetails";
import BookGrid from "./components/books/BookGrid";
import Home from "./pages/Home";
import {
  askLibraryAssistant,
  getBooks,
  searchBooks,
} from "./services/libraryService";

const DEFAULT_FILTERS = {
  level: "all",
  category: "all",
  availability: "all",
};

const SEARCH_HISTORY_KEY = "bookwise_search_history";
const SEARCH_HISTORY_VERSION_KEY =
  "bookwise_search_history_version";
const SEARCH_HISTORY_VERSION = "2";

const SAVED_BOOKS_KEY = "bookwise_saved_books";
const PERSONALIZED_KEY =
  "bookwise_personalized_recommendations";
const SAVE_HISTORY_KEY =
  "bookwise_save_search_history";
const REMEMBER_FILTERS_KEY =
  "bookwise_remember_filters";
const FILTERS_KEY = "bookwise_filters";

function readStoredBoolean(key, fallback = true) {
  try {
    const stored = localStorage.getItem(key);

    return stored === null
      ? fallback
      : stored === "true";
  } catch {
    return fallback;
  }
}

function readStoredFilters() {
  try {
    const stored = localStorage.getItem(FILTERS_KEY);

    if (!stored) {
      return DEFAULT_FILTERS;
    }

    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_FILTERS;
    }

    return {
      level:
        typeof parsed.level === "string"
          ? parsed.level
          : "all",
      category:
        typeof parsed.category === "string"
          ? parsed.category
          : "all",
      availability:
        typeof parsed.availability === "string"
          ? parsed.availability
          : "all",
    };
  } catch {
    return DEFAULT_FILTERS;
  }
}

function readStoredArray(key) {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeSavedIds(items = []) {
  return [
    ...new Set(
      items
        .map((item) =>
          item === null || item === undefined
            ? ""
            : String(item)
        )
        .filter(
          (item) =>
            item.trim() !== "" &&
            item !== "null" &&
            item !== "undefined"
        )
    ),
  ];
}

function createSessionId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `bookwise-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function extractAssistantMessage(response) {
  if (typeof response === "string") {
    return response;
  }

  return (
    response?.response ||
    response?.answer ||
    response?.reply ||
    response?.content ||
    ""
  );
}

function extractResponseBooks(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.recommended_books)) {
    return response.recommended_books;
  }

  if (Array.isArray(response?.books)) {
    return response.books;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (Array.isArray(response?.data?.recommended_books)) {
    return response.data.recommended_books;
  }

  if (Array.isArray(response?.data?.books)) {
    return response.data.books;
  }

  if (Array.isArray(response?.data?.results)) {
    return response.data.results;
  }

  return [];
}

function App() {
  const [page, setPage] = useState("home");

  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");

  const [catalog, setCatalog] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [messages, setMessages] = useState([]);

  const [sessionId, setSessionId] = useState(
    createSessionId
  );

  const [filterOptions, setFilterOptions] =
    useState({
      levels: [],
      categories: [],
      availability: [],
    });

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] =
    useState(false);
  const [chatLoading, setChatLoading] =
    useState(false);
  const [error, setError] = useState("");

  const [showBookResults, setShowBookResults] =
    useState(false);

  const [filters, setFilters] = useState(() => {
    return readStoredFilters();
  });

  const [searchHistory, setSearchHistory] =
    useState(() => {
      try {
        const storedVersion =
          localStorage.getItem(
            SEARCH_HISTORY_VERSION_KEY
          );

        if (
          storedVersion !==
          SEARCH_HISTORY_VERSION
        ) {
          localStorage.setItem(
            SEARCH_HISTORY_VERSION_KEY,
            SEARCH_HISTORY_VERSION
          );

          localStorage.removeItem(
            SEARCH_HISTORY_KEY
          );

          return [];
        }

        const stored = localStorage.getItem(
          SEARCH_HISTORY_KEY
        );

        if (!stored) {
          return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
          return [];
        }

        return parsed
          .filter(
            (item) =>
              typeof item === "string" &&
              item.trim().length > 0
          )
          .map((item) => item.trim())
          .slice(0, 10);
      } catch {
        return [];
      }
    });

  const [saved, setSaved] = useState(() => {
    return normalizeSavedIds(
      readStoredArray(SAVED_BOOKS_KEY)
    );
  });

  const [
    personalizedRecommendations,
    setPersonalizedRecommendations,
  ] = useState(() =>
    readStoredBoolean(
      PERSONALIZED_KEY,
      true
    )
  );

  const [
    saveSearchHistory,
    setSaveSearchHistory,
  ] = useState(() =>
    readStoredBoolean(
      SAVE_HISTORY_KEY,
      true
    )
  );

  const [
    rememberFilters,
    setRememberFilters,
  ] = useState(() =>
    readStoredBoolean(
      REMEMBER_FILTERS_KEY,
      true
    )
  );

  const [selected, setSelected] = useState(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const searchRequestRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const loadCatalog = async () => {
      try {
        setLoading(true);
        setError("");

        const books = await getBooks();

        if (cancelled) {
          return;
        }

        const safeBooks = Array.isArray(books)
          ? books
          : [];

        setCatalog(safeBooks);
        setSearchResults([]);

        const levels = [
          ...new Set(
            safeBooks
              .map((book) => book.level)
              .filter(Boolean)
          ),
        ];

        const categories = [
          ...new Set(
            safeBooks
              .map((book) => book.category)
              .filter(Boolean)
          ),
        ];

        const availability = [
          ...new Set(
            safeBooks
              .map(
                (book) =>
                  book.status ||
                  book.availability
              )
              .filter(Boolean)
          ),
        ];

        setFilterOptions({
          levels,
          categories,
          availability,
        });
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setCatalog([]);
        setSearchResults([]);

        setError(
          loadError?.message ||
            "Unable to connect to the library backend."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        SAVED_BOOKS_KEY,
        JSON.stringify(saved)
      );
    } catch {
      // Ignore storage errors.
    }
  }, [saved]);

  useEffect(() => {
    try {
      localStorage.setItem(
        SEARCH_HISTORY_KEY,
        JSON.stringify(searchHistory)
      );
    } catch {
      // Ignore storage errors.
    }
  }, [searchHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(
        PERSONALIZED_KEY,
        String(
          personalizedRecommendations
        )
      );
    } catch {
      // Ignore storage errors.
    }
  }, [personalizedRecommendations]);

  useEffect(() => {
    try {
      localStorage.setItem(
        SAVE_HISTORY_KEY,
        String(saveSearchHistory)
      );
    } catch {
      // Ignore storage errors.
    }
  }, [saveSearchHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(
        REMEMBER_FILTERS_KEY,
        String(rememberFilters)
      );

      if (rememberFilters) {
        localStorage.setItem(
          FILTERS_KEY,
          JSON.stringify(filters)
        );
      } else {
        localStorage.removeItem(FILTERS_KEY);
      }
    } catch {
      // Ignore storage errors.
    }
  }, [rememberFilters, filters]);

  const latestAssistantMessage = useMemo(() => {
    return (
      [...messages]
        .reverse()
        .find(
          (message) =>
            message.role === "assistant"
        )?.content || ""
    );
  }, [messages]);

  const results = useMemo(() => {
    if (searched) {
      return searchResults;
    }

    return catalog.filter((book) => {
      const bookStatus =
        book.status || book.availability;

      const matchesLevel =
        filters.level === "all" ||
        book.level === filters.level;

      const matchesCategory =
        filters.category === "all" ||
        book.category === filters.category;

      const matchesAvailability =
        filters.availability === "all" ||
        bookStatus === filters.availability;

      return (
        matchesLevel &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [
    catalog,
    searched,
    searchResults,
    filters,
  ]);

  const savedBooks = useMemo(() => {
    const savedIds = new Set(
      saved.map((id) => String(id))
    );

    return catalog.filter((book) =>
      savedIds.has(String(book.id ?? ""))
    );
  }, [catalog, saved]);

  const handleSearch = useCallback(
    async (
      event,
      submittedQuery = query
    ) => {
      event?.preventDefault();

      const value =
        typeof submittedQuery === "string"
          ? submittedQuery.trim()
          : "";

      if (!value || chatLoading) {
        return;
      }

      const requestId =
        searchRequestRef.current + 1;

      searchRequestRef.current =
        requestId;

      const isFollowUp =
        Boolean(
          searched && showBookResults
        );

      setQuery("");
      setSearched(value);

      if (!isFollowUp) {
        setSearchResults([]);
        setShowBookResults(false);
      }

      setSearchLoading(true);
      setChatLoading(true);
      setError("");

      setMessages((current) => [
        ...current,
        {
          role: "user",
          content: value,
        },
      ]);

      if (saveSearchHistory) {
        setSearchHistory((history) => {
          const filtered =
            history.filter(
              (item) =>
                item.toLowerCase() !==
                value.toLowerCase()
            );

          return [value, ...filtered].slice(
            0,
            10
          );
        });
      }

      try {
        const response =
          await askLibraryAssistant(
            sessionId,
            value
          );

        if (
          requestId !==
          searchRequestRef.current
        ) {
          return;
        }

        const assistantMessage =
          extractAssistantMessage(
            response
          );

        if (assistantMessage) {
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content: assistantMessage,
            },
          ]);
        }

        const responseBooks =
          extractResponseBooks(response);

        const responseMode =
          response?.mode || "";

        if (responseBooks.length > 0) {
          setSearchResults(responseBooks);
          setShowBookResults(true);
        } else if (
          responseMode === "rag"
        ) {
          setSearchResults([]);
          setShowBookResults(true);
        } else if (!isFollowUp) {
          setSearchResults([]);
          setShowBookResults(false);
        }
      } catch (chatError) {
        if (
          requestId !==
          searchRequestRef.current
        ) {
          return;
        }

        try {
          const fallbackBooks =
            await searchBooks({
              query: value,
              ...filters,
            });

          if (
            requestId !==
            searchRequestRef.current
          ) {
            return;
          }

          const safeFallbackBooks =
            Array.isArray(fallbackBooks)
              ? fallbackBooks
              : [];

          setSearchResults(
            safeFallbackBooks
          );
          setShowBookResults(true);

          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                safeFallbackBooks.length > 0
                  ? "I found the closest matching books for your search."
                  : "I couldn't find matching books for that request. Try describing the topic or learning goal a little differently.",
            },
          ]);
        } catch {
          if (!isFollowUp) {
            setSearchResults([]);
          }

          setShowBookResults(true);

          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                chatError?.message ||
                "I couldn't complete that search. Please try again.",
            },
          ]);

          setError(
            chatError?.message ||
              "Unable to search the library."
          );
        }
      } finally {
        if (
          requestId ===
          searchRequestRef.current
        ) {
          setSearchLoading(false);
          setChatLoading(false);
        }
      }
    },
    [
      chatLoading,
      filters,
      query,
      saveSearchHistory,
      searched,
      sessionId,
      showBookResults,
    ]
  );

  const toggleSaved = useCallback((id) => {
    const normalizedId = String(id ?? "").trim();

    if (
      normalizedId === "" ||
      normalizedId === "null" ||
      normalizedId === "undefined"
    ) {
      return;
    }

    setSaved((items) => {
      const current = normalizeSavedIds(items);

      if (current.includes(normalizedId)) {
        return current.filter(
          (item) => item !== normalizedId
        );
      }

      return [...current, normalizedId];
    });
  }, []);

  const removeSearchHistory =
    useCallback((itemToRemove) => {
      setSearchHistory((history) =>
        history.filter(
          (item) =>
            item !== itemToRemove
        )
      );
    }, []);

  const clearSearchHistory =
    useCallback(() => {
      setSearchHistory([]);
    }, []);

  const openExploreBooks =
    useCallback(() => {
      searchRequestRef.current += 1;

      setQuery("");
      setSearched("");
      setSearchResults([]);
      setShowBookResults(false);
      setMessages([]);
      setSessionId(createSessionId());
      setFilters(DEFAULT_FILTERS);
      setSearchLoading(false);
      setChatLoading(false);
      setError("");
      setSelected(null);
      setPage("home");
      setMobileOpen(false);
    }, []);

  const handleNavigate =
    useCallback((nextPage) => {
      const validPages = [
        "home",
        "saved",
        "history",
        "settings",
      ];

      setPage(
        validPages.includes(nextPage)
          ? nextPage
          : "home"
      );

      setMobileOpen(false);
    }, []);

  const handleDetails = useCallback(
    (book) => {
      if (!book) {
        return;
      }

      setSelected(book);
    },
    []
  );

  const closeDetails = useCallback(() => {
    setSelected(null);
  }, []);

  const handleFilterChange = async (
    name,
    value
  ) => {
    const validFilterNames = [
      "level",
      "category",
      "availability",
    ];

    if (!validFilterNames.includes(name)) {
      return;
    }

    const nextFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(nextFilters);

    if (!searched || !showBookResults) {
      return;
    }

    const requestId =
      searchRequestRef.current + 1;

    searchRequestRef.current =
      requestId;

    setSearchLoading(true);
    setError("");

    try {
      const response =
        await searchBooks({
          query: searched,
          ...nextFilters,
        });

      if (
        requestId !==
        searchRequestRef.current
      ) {
        return;
      }

      setSearchResults(
        Array.isArray(response)
          ? response
          : []
      );
    } catch (filterError) {
      if (
        requestId !==
        searchRequestRef.current
      ) {
        return;
      }

      setError(
        filterError?.message ||
          "Unable to apply the selected filter."
      );
    } finally {
      if (
        requestId ===
        searchRequestRef.current
      ) {
        setSearchLoading(false);
      }
    }
  };

  const resetFilters = async () => {
    searchRequestRef.current += 1;

    setFilters(DEFAULT_FILTERS);

    if (!searched || !showBookResults) {
      return;
    }

    const requestId =
      searchRequestRef.current;

    setSearchLoading(true);
    setError("");

    try {
      const response =
        await searchBooks({
          query: searched,
          ...DEFAULT_FILTERS,
        });

      if (
        requestId !==
        searchRequestRef.current
      ) {
        return;
      }

      setSearchResults(
        Array.isArray(response)
          ? response
          : []
      );
    } catch (resetError) {
      if (
        requestId !==
        searchRequestRef.current
      ) {
        return;
      }

      setError(
        resetError?.message ||
          "Unable to reset the filters."
      );
    } finally {
      if (
        requestId ===
        searchRequestRef.current
      ) {
        setSearchLoading(false);
      }
    }
  };

  const resetSettings = () => {
    setPersonalizedRecommendations(true);
    setSaveSearchHistory(true);
    setRememberFilters(true);
    setFilters(DEFAULT_FILTERS);
  };

  const retryConnection = () => {
    window.location.reload();
  };

  const renderContent = () => {
    if (page === "home") {
      return (
        <>
          {error && (
            <div
              className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
              role="alert"
            >
              <span>{error}</span>

              <button
                type="button"
                onClick={retryConnection}
                className="w-fit rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-red-700 shadow-sm transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                Retry
              </button>
            </div>
          )}

          <Home
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            conversation={messages}
            chatLoading={chatLoading}
            assistantResponse={
              latestAssistantMessage
            }
            books={results}
            saved={saved}
            onSave={toggleSaved}
            onDetails={handleDetails}
            filters={filters}
            options={filterOptions}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            onExploreBooks={openExploreBooks}
            loading={loading || searchLoading}
            personalizedRecommendations={
              personalizedRecommendations
            }
            searched={searched}
            showBookResults={showBookResults}
          />
        </>
      );
    }

    if (page === "saved") {
      return (
        <section className="mx-auto w-full max-w-screen-2xl">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Your Collection
              </p>

              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                Saved Books
              </h1>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Books you saved for later.
              </p>
            </div>

            {savedBooks.length > 0 && (
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {savedBooks.length}{" "}
                {savedBooks.length === 1
                  ? "book"
                  : "books"}
              </span>
            )}
          </div>

          {loading ? (
            <BookGrid
              books={[]}
              saved={saved}
              onSave={toggleSaved}
              onDetails={handleDetails}
              loading={true}
            />
          ) : savedBooks.length > 0 ? (
            <BookGrid
              books={savedBooks}
              saved={saved}
              onSave={toggleSaved}
              onDetails={handleDetails}
            />
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 text-center shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <Search
                  size={20}
                  aria-hidden="true"
                />
              </div>

              <h2 className="font-display text-lg font-bold text-slate-800">
                No saved books yet
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Save books from your
                recommendations and they will
                appear here for easy access.
              </p>

              <button
                type="button"
                onClick={openExploreBooks}
                className="mt-5 rounded-lg bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Explore Books
              </button>
            </div>
          )}
        </section>
      );
    }

    if (page === "history") {
      return (
        <section className="mx-auto w-full max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-orange-500">
                Bookwise
              </p>

              <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
                Search History
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your recent learning goals.
              </p>
            </div>

            {searchHistory.length > 0 && (
              <button
                type="button"
                onClick={clearSearchHistory}
                className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              >
                Clear all
              </button>
            )}
          </div>

          {searchHistory.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {searchHistory.map(
                (item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="group flex items-center gap-3 border-b border-slate-100 px-4 py-4 transition last:border-b-0 hover:bg-slate-50 sm:gap-4 sm:px-5"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(item);
                        handleSearch(
                          null,
                          item
                        );
                      }}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left focus:outline-none sm:gap-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-white">
                        <Search
                          size={16}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {item}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Recent search
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeSearchHistory(
                          item
                        )
                      }
                      aria-label={`Remove ${item} from search history`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    >
                      <X
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <Search
                  size={20}
                  aria-hidden="true"
                />
              </div>

              <h2 className="font-display text-lg font-bold text-slate-800">
                No search history
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your completed searches will
                appear here.
              </p>
            </div>
          )}
        </section>
      );
    }

    if (page === "settings") {
      return (
        <section className="mx-auto w-full max-w-4xl">
          <div className="mb-8">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-orange-500">
              Bookwise
            </p>

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
              Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Control how Bookwise searches,
              remembers your activity, and
              personalizes your learning
              experience.
            </p>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Sparkles
                      size={18}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2 className="font-display font-bold text-slate-800">
                      Learning experience
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Choose how Bookwise uses
                      your activity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                <button
                  type="button"
                  role="switch"
                  aria-checked={
                    personalizedRecommendations
                  }
                  onClick={() =>
                    setPersonalizedRecommendations(
                      (current) => !current
                    )
                  }
                  className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-200"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Sparkles
                      size={17}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Personalized
                      recommendations
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Use your searches and
                      learning interests to
                      improve book
                      recommendations.
                    </p>
                  </div>

                  <span
                    className={`relative flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${
                      personalizedRecommendations
                        ? "bg-slate-700"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        personalizedRecommendations
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={
                    saveSearchHistory
                  }
                  onClick={() =>
                    setSaveSearchHistory(
                      (current) => !current
                    )
                  }
                  className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-200"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Search
                      size={17}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Save search history
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Keep your completed
                      searches available from
                      Search History.
                    </p>
                  </div>

                  <span
                    className={`relative flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${
                      saveSearchHistory
                        ? "bg-slate-700"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        saveSearchHistory
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <SlidersHorizontal
                      size={18}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2 className="font-display font-bold text-slate-800">
                      Search preferences
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Control what Bookwise
                      remembers.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={rememberFilters}
                onClick={() =>
                  setRememberFilters(
                    (current) => !current
                  )
                }
                className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Settings2
                    size={17}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Remember filters
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Keep your selected level,
                    category, and availability
                    filters between visits.
                  </p>
                </div>

                <span
                  className={`relative flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${
                    rememberFilters
                      ? "bg-slate-700"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      rememberFilters
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Trash2
                    size={16}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Reset preferences
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Restore all Bookwise
                    preferences to their
                    defaults.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetSettings}
                className="w-fit shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs font-medium text-slate-600">
              <Check
                size={15}
                strokeWidth={2.5}
                aria-hidden="true"
              />
              Your preferences are saved
              automatically.
            </div>
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <DashboardLayout
      page={page}
      onNavigate={handleNavigate}
      mobileOpen={mobileOpen}
      onOpenMenu={() => setMobileOpen(true)}
      onCloseMenu={() =>
        setMobileOpen(false)
      }
    >
      {renderContent()}

      <BookDetails
        book={selected}
        onClose={closeDetails}
      />
    </DashboardLayout>
  );
}

export default App;
