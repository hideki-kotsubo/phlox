import { useState, useEffect, useMemo, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-600 text-lg">Loading thoughts...</p>
    </div>
  );
}

// Loading more component
function LoadingMore() {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4 bg-white rounded-xl my-4 border border-gray-200 shadow-sm">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-600 text-base m-0">Loading more thoughts...</p>
    </div>
  );
}

// End message component
function EndMessage() {
  return (
    <div className="text-center p-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl my-8 shadow-lg">
      <p className="text-xl font-semibold mb-2">
        🎉 You've seen all the thoughts!
      </p>
      <p className="text-emerald-100">
        Scroll up to review or use search to find specific content.
      </p>
    </div>
  );
}

// Error component
function ErrorMessage({ error, onRetry }) {
  return (
    <div className="text-center p-12 max-w-md mx-auto">
      <h2 className="text-red-600 mb-4 text-2xl font-bold">
        Error loading thoughts
      </h2>
      <p className="mb-6 text-gray-600 leading-relaxed">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-red-600 text-white border-none rounded-lg text-base cursor-pointer hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

// Individual thought component
function ThoughtCard({ thought, isActive, onClick }) {
  return (
    <div
      className={`thought-card p-6 bg-white border rounded-xl shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 ${
        isActive
          ? "bg-blue-50 border-blue-500 border-2 -translate-y-1 shadow-lg"
          : "border-gray-200"
      }`}
      onClick={onClick}
    >
      <blockquote className="text-lg text-gray-800 mb-4 italic leading-relaxed">
        "{thought.text}"
      </blockquote>
      <div className="flex justify-between items-center flex-wrap gap-2">
        <cite className="text-sm text-gray-600 font-medium not-italic">
          — {thought.author}
        </cite>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize font-medium">
          {thought.category}
        </span>
      </div>
    </div>
  );
}

// Main app component
export default function App() {
  // Data loading states
  const [allThoughts, setAllThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Infinite scroll states
  const [displayedThoughts, setDisplayedThoughts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // UI states
  const [selectedThought, setSelectedThought] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Configuration
  const BATCH_SIZE = 20;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!allThoughts || allThoughts.length === 0) return ["all"];
    return ["all", ...new Set(allThoughts.map((thought) => thought.category))];
  }, [allThoughts]);

  // Filter thoughts
  const filteredThoughts = useMemo(() => {
    if (!allThoughts || allThoughts.length === 0) return [];

    return allThoughts.filter((thought) => {
      const matchesSearch =
        debouncedSearchTerm === "" ||
        thought.text
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        thought.author
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || thought.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allThoughts, debouncedSearchTerm, filterCategory]);

  // Load initial batch when filtered thoughts change
  useEffect(() => {
    if (filteredThoughts.length > 0) {
      const initialBatch = filteredThoughts.slice(0, BATCH_SIZE);
      setDisplayedThoughts(initialBatch);
      setHasMore(filteredThoughts.length > BATCH_SIZE);
    } else {
      setDisplayedThoughts([]);
      setHasMore(false);
    }
  }, [filteredThoughts]);

  // Load JSON data
  useEffect(() => {
    const loadThoughts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/thoughts.json");

        if (!response.ok) {
          throw new Error(
            `Failed to load thoughts.json. Make sure the file exists in the public/ folder.`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            `Expected an array of thoughts, but got ${typeof data}.`
          );
        }

        setAllThoughts(data);
        console.log(`✅ SUCCESS: Loaded ${data.length} thoughts`);
      } catch (err) {
        console.error("❌ Error loading thoughts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadThoughts();
  }, []);

  // Load more function
  const loadMore = useCallback(() => {
    if (loadingMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const currentLength = displayedThoughts.length;
      const nextBatch = filteredThoughts.slice(
        currentLength,
        currentLength + BATCH_SIZE
      );

      if (nextBatch.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedThoughts((prev) => [...prev, ...nextBatch]);
        setHasMore(currentLength + nextBatch.length < filteredThoughts.length);
      }

      setLoadingMore(false);
    }, 500);
  }, [displayedThoughts.length, filteredThoughts, loadingMore]);

  // Event handlers
  const retryLoading = () => window.location.reload();
  const handleThoughtClick = (thought) =>
    setSelectedThought(selectedThought?.id === thought.id ? null : thought);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setFilterCategory(e.target.value);

  const getRandomThought = () => {
    const randomIndex = Math.floor(Math.random() * filteredThoughts.length);
    const randomThought = filteredThoughts[randomIndex];
    setSelectedThought(randomThought);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setFilterCategory("all");
    scrollToTop();
  };

  const loadAllRemaining = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedThoughts(filteredThoughts);
      setHasMore(false);
      setLoadingMore(false);
    }, 1000);
  };

  // Show loading state
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={retryLoading} />;

  // Show empty state
  if (!allThoughts || allThoughts.length === 0) {
    return (
      <div className="text-center p-12 max-w-2xl mx-auto">
        <h2 className="text-gray-800 mb-4 text-2xl font-bold">
          No thoughts found
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Please add a thoughts.json file to your project.
        </p>
        <div className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
          <p className="font-semibold text-gray-800 mb-2">
            Where to place your file:
          </p>
          <p className="text-gray-600">
            <strong>Required:</strong>{" "}
            <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">
              public/thoughts.json
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 sticky top-0 bg-gray-50/90 backdrop-blur-sm py-4 z-20 border-b border-gray-200/50">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-shadow">
            Daily Thoughts & Sayings s
          </h1>
          <p className="text-gray-600 text-lg">
            Wisdom from great minds to inspire your day{" "}
            <span className="text-blue-600 font-semibold">
              ({allThoughts.length} thoughts • Tailwind v4 • Infinite Scroll)
            </span>
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 sticky top-20 bg-gray-50/90 backdrop-blur-sm py-4 z-10 border-b border-gray-200/50">
          <input
            type="text"
            placeholder="Search thoughts or authors..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 min-w-64 px-4 py-3 border border-gray-300 rounded-lg text-base bg-white/90 backdrop-blur-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <select
            value={filterCategory}
            onChange={handleCategoryChange}
            className="px-4 py-3 border border-gray-300 rounded-lg text-base bg-white/90 backdrop-blur-sm cursor-pointer transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={getRandomThought}
            className="px-6 py-3 bg-blue-500 text-white border-none rounded-lg text-base cursor-pointer whitespace-nowrap hover:bg-blue-600 active:scale-95 transition-all duration-200"
          >
            🎲 Random Thought
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-gray-200 sticky top-36 bg-gray-50/90 backdrop-blur-sm py-3 z-10 gap-3">
          <div className="text-sm text-gray-600 font-medium">
            Showing {displayedThoughts.length} of {filteredThoughts.length}{" "}
            thoughts
            {filteredThoughts.length !== allThoughts.length && (
              <span className="text-blue-600">
                {" "}
                (filtered from {allThoughts.length} total)
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={scrollToTop}
              className="px-3 py-2 bg-gray-600 text-white border-none rounded text-sm cursor-pointer hover:bg-gray-700 active:scale-95 transition-all duration-200"
            >
              ↑ Back to Top
            </button>
            {hasMore && (
              <button
                onClick={loadAllRemaining}
                className="px-3 py-2 bg-emerald-500 text-white border-none rounded text-sm cursor-pointer hover:bg-emerald-600 active:scale-95 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loadingMore}
              >
                {loadingMore ? "⏳ Loading..." : "⚡ Load All"}
              </button>
            )}
            {(searchTerm || filterCategory !== "all") && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 bg-red-500 text-white border-none rounded text-sm cursor-pointer hover:bg-red-600 active:scale-95 transition-all duration-200"
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Featured thought */}
        {selectedThought && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              ⭐ Featured Thought
            </h2>
            <blockquote className="text-lg mb-3 italic leading-relaxed">
              "{selectedThought.text}"
            </blockquote>
            <cite className="text-blue-100 not-italic">
              — {selectedThought.author}
            </cite>
          </div>
        )}

        {/* Infinite Scroll */}
        <InfiniteScroll
          dataLength={displayedThoughts.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<LoadingMore />}
          endMessage={<EndMessage />}
          refreshFunction={() => window.location.reload()}
          pullDownToRefresh={true}
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <h3 className="text-center text-gray-600 py-4">
              ⬇️ Pull down to refresh
            </h3>
          }
          releaseToRefreshContent={
            <h3 className="text-center text-gray-600 py-4">
              ⬆️ Release to refresh
            </h3>
          }
          scrollThreshold={0.8}
          style={{ overflow: "visible" }}
        >
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-8">
            {displayedThoughts.map((thought, index) => (
              <ThoughtCard
                key={`${thought.id}-${index}`}
                thought={thought}
                isActive={selectedThought?.id === thought.id}
                onClick={() => handleThoughtClick(thought)}
              />
            ))}
          </div>
        </InfiniteScroll>

        {/* Performance info */}
        <div className="mt-8 text-center p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-lg text-blue-800 sticky bottom-4 z-10">
          <small className="flex items-center justify-center gap-2 flex-wrap">
            🚀{" "}
            <span className="font-medium">Tailwind v4 + Infinite Scroll</span> •
            Loaded{" "}
            <span className="font-semibold text-blue-900">
              {displayedThoughts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-blue-900">
              {filteredThoughts.length}
            </span>{" "}
            thoughts
            {hasMore && (
              <span className="text-blue-600">• Scroll for more</span>
            )}
          </small>
        </div>

        {/* No results */}
        {filteredThoughts.length === 0 && !loading && (
          <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 my-8 shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg mb-4">
              No thoughts found matching your criteria.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-500 text-white border-none rounded text-sm cursor-pointer hover:bg-red-600 active:scale-95 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
