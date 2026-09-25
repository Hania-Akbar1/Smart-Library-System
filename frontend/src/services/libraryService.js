const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }
  );

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message = errorData.detail;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}

function readText(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => readText(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

function readNestedValue(source, ...keys) {
  for (const key of keys) {
    if (source && Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      const text = readText(value);
      if (text !== null) {
        return text;
      }
    }
  }

  return null;
}

function normalizeBook(book = {}) {
  const metadata =
    book?.metadata && typeof book.metadata === "object"
      ? book.metadata
      : {};

  const nestedBook =
    book?.book && typeof book.book === "object"
      ? book.book
      : {};

  const raw = {
    ...metadata,
    ...nestedBook,
    ...book,
  };

  const title =
    readNestedValue(raw, "title", "name") ||
    readNestedValue(metadata, "title", "name") ||
    readNestedValue(nestedBook, "title", "name") ||
    "Untitled book";

  const author =
    readNestedValue(raw, "author", "authors") ||
    readNestedValue(metadata, "author", "authors") ||
    readNestedValue(nestedBook, "author", "authors") ||
    "Author unavailable";

  const level =
    readNestedValue(raw, "level") ||
    readNestedValue(metadata, "level") ||
    readNestedValue(nestedBook, "level") ||
    null;

  const category =
    readNestedValue(raw, "category") ||
    readNestedValue(metadata, "category") ||
    readNestedValue(nestedBook, "category") ||
    null;

  const status =
    readNestedValue(raw, "status") ||
    readNestedValue(metadata, "status") ||
    readNestedValue(nestedBook, "status") ||
    readNestedValue(raw, "availability") ||
    readNestedValue(metadata, "availability") ||
    readNestedValue(nestedBook, "availability") ||
    null;

  const availability =
    readNestedValue(raw, "availability") ||
    readNestedValue(metadata, "availability") ||
    readNestedValue(nestedBook, "availability") ||
    status ||
    null;

  const rack =
    readNestedValue(raw, "rack") ||
    readNestedValue(metadata, "rack") ||
    readNestedValue(nestedBook, "rack") ||
    null;

  const shelf =
    readNestedValue(raw, "shelf") ||
    readNestedValue(metadata, "shelf") ||
    readNestedValue(nestedBook, "shelf") ||
    null;

  const tone =
    readNestedValue(raw, "tone") ||
    readNestedValue(metadata, "tone") ||
    readNestedValue(nestedBook, "tone") ||
    "blue";

  const similarity =
    raw.similarity ??
    metadata.similarity ??
    nestedBook.similarity ??
    null;

  return {
    ...raw,
    id:
      raw.id ??
      metadata.id ??
      nestedBook.id ??
      null,
    title,
    author,
    level,
    category,
    status,
    availability,
    rack,
    shelf,
    tone,
    similarity,
    section:
      readNestedValue(raw, "section") ||
      readNestedValue(metadata, "section") ||
      readNestedValue(nestedBook, "section") ||
      null,
    pages:
      readNestedValue(raw, "pages") ||
      readNestedValue(metadata, "pages") ||
      readNestedValue(nestedBook, "pages") ||
      null,
    year:
      readNestedValue(raw, "year") ||
      readNestedValue(metadata, "year") ||
      readNestedValue(nestedBook, "year") ||
      null,
    language:
      readNestedValue(raw, "language") ||
      readNestedValue(metadata, "language") ||
      readNestedValue(nestedBook, "language") ||
      null,
    isbn:
      readNestedValue(raw, "isbn") ||
      readNestedValue(metadata, "isbn") ||
      readNestedValue(nestedBook, "isbn") ||
      null,
    description:
      readNestedValue(raw, "description") ||
      readNestedValue(metadata, "description") ||
      readNestedValue(nestedBook, "description") ||
      null,
  };
}

function normalizeBooksResponse(response) {
  let books = [];

  if (Array.isArray(response)) {
    books = response;
  } else if (Array.isArray(response?.data)) {
    books = response.data;
  } else if (Array.isArray(response?.books)) {
    books = response.books;
  } else if (Array.isArray(response?.recommended_books)) {
    books = response.recommended_books;
  } else if (
    Array.isArray(response?.data?.recommended_books)
  ) {
    books = response.data.recommended_books;
  }

  return books.map(normalizeBook);
}

export async function getBooks() {
  const response = await request("/books");

  return normalizeBooksResponse(response);
}

export async function getBookById(id) {
  const response = await request(
    `/books/${encodeURIComponent(id)}`
  );

  const book =
    response?.data ??
    response?.book ??
    response ??
    null;

  return book ? normalizeBook(book) : null;
}

export async function searchBooks({
  query = "",
  level = "all",
  category = "all",
  availability = "all",
} = {}) {
  const trimmedQuery = query.trim();

  let books;

  if (trimmedQuery) {
    const params = new URLSearchParams({
      query: trimmedQuery,
    });

    const response = await request(
      `/books/search?${params.toString()}`
    );

    books = normalizeBooksResponse(response);
  } else {
    books = await getBooks();
  }

  return books.filter((book) => {
    const matchesLevel =
      level === "all" ||
      book.level === level;

    const matchesCategory =
      category === "all" ||
      book.category === category;

    const bookStatus =
      book.status || book.availability;

    const matchesAvailability =
      availability === "all" ||
      bookStatus === availability;

    return (
      matchesLevel &&
      matchesCategory &&
      matchesAvailability
    );
  });
}

export async function getRecommendedBooks(limit = 6) {
  const books = await getBooks();

  return books.slice(0, limit);
}

export async function getBookFilters() {
  const books = await getBooks();

  return {
    levels: [
      ...new Set(
        books
          .map((book) => book.level)
          .filter(Boolean)
      ),
    ],

    categories: [
      ...new Set(
        books
          .map((book) => book.category)
          .filter(Boolean)
      ),
    ],

    availability: [
      ...new Set(
        books
          .map(
            (book) =>
              book.status ||
              book.availability
          )
          .filter(Boolean)
      ),
    ],
  };
}

export async function searchBooksRag(
  query,
  count = 5
) {
  const params = new URLSearchParams({
    query: query.trim(),
    count: String(count),
  });

  const response = await request(
    `/books/rag?${params.toString()}`
  );

  return {
    ...response,

    recommended_books:
      normalizeBooksResponse(response),
  };
}

export async function askLibraryAssistant(
  sessionId,
  message
) {
  const response = await request("/chat", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  });

  return {
    ...response,

    recommended_books:
      normalizeBooksResponse(response),

    memory: Array.isArray(response?.memory)
      ? response.memory
      : [],
  };
}