import { useState, useEffect, useMemo, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-600 text-lg">Carregando pensamentos...</p>
    </div>
  );
}

// Loading more component
function LoadingMore() {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4 bg-white rounded-xl my-4 border border-gray-200 shadow-sm">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-600 text-base m-0">Carregando mais pensamentos...</p>
    </div>
  );
}

// End message component
function EndMessage() {
  return (
    <div className="text-center p-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white rounded-2xl my-8 shadow-xl">
      <p className="text-xl font-semibold mb-2">
        🎉 Você viu todos os pensamentos!
      </p>
      <p className="text-emerald-100">
        Role para cima para revisar ou use a busca para encontrar conteúdo específico.
      </p>
    </div>
  );
}

// Error component
function ErrorMessage({ error, onRetry }) {
  return (
    <div className="text-center p-12 max-w-md mx-auto">
      <h2 className="text-red-600 mb-4 text-2xl font-bold">
        Erro ao carregar pensamentos
      </h2>
      <p className="mb-6 text-gray-600 leading-relaxed">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-red-600 text-white border-none rounded-lg text-base cursor-pointer hover:bg-red-700 transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  );
}

// Individual thought component with advanced design
function ThoughtCard({ thought, isActive, onClick }) {
  // Dynamic styling based on category
  const getCategoryStyles = (category) => {
    const styles = {
      'motivação': {
        gradient: 'from-orange-500/10 via-red-500/10 to-pink-500/10',
        border: 'border-orange-300',
        hoverBorder: 'hover:border-orange-400',
        accent: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200',
        icon: '⚡',
        pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1)_0%,transparent_50%)]'
      },
      'amor': {
        gradient: 'from-pink-500/10 via-rose-500/10 to-red-500/10',
        border: 'border-pink-300',
        hoverBorder: 'hover:border-pink-400',
        accent: 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-200',
        icon: '💖',
        pattern: 'bg-[radial-gradient(circle_at_30%_30%,rgba(244,63,94,0.1)_0%,transparent_50%)]'
      },
      'sabedoria': {
        gradient: 'from-indigo-500/10 via-purple-500/10 to-blue-500/10',
        border: 'border-indigo-300',
        hoverBorder: 'hover:border-indigo-400',
        accent: 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200',
        icon: '🔮',
        pattern: 'bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.1)_0%,transparent_50%)]'
      },
      'natureza': {
        gradient: 'from-emerald-500/10 via-green-500/10 to-teal-500/10',
        border: 'border-emerald-300',
        hoverBorder: 'hover:border-emerald-400',
        accent: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200',
        icon: '🌿',
        pattern: 'bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1)_0%,transparent_50%)]'
      },
      'sucesso': {
        gradient: 'from-amber-500/10 via-yellow-500/10 to-orange-500/10',
        border: 'border-amber-300',
        hoverBorder: 'hover:border-amber-400',
        accent: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200',
        icon: '🏆',
        pattern: 'bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.1)_0%,transparent_50%)]'
      },
      'default': {
        gradient: 'from-purple-500/10 via-blue-500/10 to-indigo-500/10',
        border: 'border-purple-300',
        hoverBorder: 'hover:border-purple-400',
        accent: 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200',
        icon: '✨',
        pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1)_0%,transparent_50%)]'
      }
    };

    // Find matching style or use default
    const categoryLower = category.toLowerCase();
    for (const [key, style] of Object.entries(styles)) {
      if (categoryLower.includes(key) || key === 'default') {
        return style;
      }
    }
    return styles.default;
  };

  const categoryStyle = getCategoryStyles(thought.category);

  return (
    <div
      className={`thought-card group relative p-6 bg-white/95 backdrop-blur-sm border-2 rounded-3xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 ${categoryStyle.hoverBorder} ${
        isActive
          ? `bg-gradient-to-br ${categoryStyle.gradient} ${categoryStyle.border} -translate-y-3 shadow-2xl rotate-1`
          : categoryStyle.border
      } overflow-hidden`}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${categoryStyle.pattern} opacity-50`}></div>

      {/* Decorative Corner Element */}
      <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-sm group-hover:scale-110 transition-transform duration-300"></div>

      {/* Category Icon */}
      <div className="absolute top-4 right-4 text-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-300">
        {categoryStyle.icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <blockquote className="text-lg text-gray-800 mb-6 italic leading-relaxed font-medium group-hover:text-gray-900 transition-colors duration-300 relative">
          <span className="text-4xl text-purple-300 absolute -top-3 -left-2 font-serif leading-none">"</span>
          <span className="inline-block px-6 py-2">{thought.text}</span>
          <span className="text-4xl text-purple-300 absolute -bottom-3 -right-2 font-serif leading-none">"</span>
        </blockquote>

        <div className="flex justify-between items-end flex-wrap gap-3 mt-4">
          <cite className="text-sm text-gray-600 font-semibold not-italic group-hover:text-gray-700 transition-colors duration-300 flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-purple-300 to-transparent"></div>
            {thought.author}
          </cite>
          <span className={`px-4 py-2 ${categoryStyle.accent} rounded-full text-xs font-bold uppercase tracking-wide shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
            {thought.category}
          </span>
        </div>
      </div>

      {/* Animated Border Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
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
          Nenhum pensamento encontrado
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Por favor, adicione um arquivo thoughts.json ao seu projeto.
        </p>
        <div className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
          <p className="font-semibold text-gray-800 mb-2">
            Onde colocar seu arquivo:
          </p>
          <p className="text-gray-600">
            <strong>Obrigatório:</strong>{" "}
            <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">
              public/thoughts.json
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 relative overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="floating-decoration w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl"></div>
      <div className="floating-decoration w-24 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-lg"></div>
      <div className="floating-decoration w-40 h-40 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-2xl"></div>
      <div className="floating-decoration w-28 h-28 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-xl"></div>

      {/* Mobile Search Button - Outside Header */}
      <button
        onClick={toggleMobileSearch}
        className="absolute top-4 right-4 sm:hidden p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 z-30"
        aria-label="Alternar busca"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-8 sticky top-0 bg-white/95 backdrop-blur-md py-8 z-20 border-b border-purple-200/30 rounded-b-3xl shadow-lg">
          <div className="relative max-w-4xl mx-auto">
            {/* Logo and App Name */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Phlox Flower Logo */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C21 10.1 20.1 11 19 11C17.9 11 17 10.1 17 9C17 7.9 17.9 7 19 7C20.1 7 21 7.9 21 9ZM3 9C3 10.1 3.9 11 5 11C6.1 11 7 10.1 7 9C7 7.9 6.1 7 5 7C3.9 7 3 7.9 3 9ZM15.5 6.5C15.5 7.6 14.6 8.5 13.5 8.5C12.4 8.5 11.5 7.6 11.5 6.5C11.5 5.4 12.4 4.5 13.5 4.5C14.6 4.5 15.5 5.4 15.5 6.5ZM8.5 6.5C8.5 7.6 9.4 8.5 10.5 8.5C11.6 8.5 12.5 7.6 12.5 6.5C12.5 5.4 11.6 4.5 10.5 4.5C9.4 4.5 8.5 5.4 8.5 6.5ZM12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22ZM17 15C17 16.1 16.1 17 15 17C13.9 17 13 16.1 13 15C13 13.9 13.9 13 15 13C16.1 13 17 13.9 17 15ZM7 15C7 16.1 7.9 17 9 17C10.1 17 11 16.1 11 15C11 13.9 10.1 13 9 13C7.9 13 7 13.9 7 15Z"/>
                  </svg>
                </div>
                {/* Floating petals */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-bounce"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-bounce" style={{animationDelay: '0.5s'}}></div>
              </div>

              {/* App Name */}
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-1 tracking-tight">
                  Phlox
                </h1>
                <div className="text-sm text-gray-500 font-medium tracking-wider uppercase">
                  Pensamentos & Reflexões
                </div>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-gray-600 text-lg font-medium max-w-sm sm:max-w-none mx-auto leading-relaxed px-6 mb-2 sm:whitespace-nowrap">
              Sabedoria de grandes mentes para inspirar seu dia
            </p>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </header>

        {/* Controls */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          mobileSearchOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 sm:max-h-96 sm:opacity-100'
        } sm:block sticky top-20 bg-white/80 backdrop-blur-sm z-10 border-b border-purple-200/50 shadow-sm rounded-2xl mx-2 sm:mx-0`}>
          <div className="flex flex-col sm:flex-row gap-4 px-6 py-6">
            <input
              type="text"
              placeholder="Buscar pensamentos ou autores..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 min-w-64 px-4 py-3 border border-purple-300 rounded-2xl text-base bg-white/90 backdrop-blur-sm transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 shadow-sm"
            />
            <select
              value={filterCategory}
              onChange={handleCategoryChange}
              className="px-4 py-3 border border-purple-300 rounded-2xl text-base bg-white/90 backdrop-blur-sm cursor-pointer transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 shadow-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={getRandomThought}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none rounded-2xl text-base cursor-pointer whitespace-nowrap hover:from-purple-600 hover:to-blue-600 active:scale-95 transition-all duration-200 shadow-lg"
            >
              🎲 Pensamento Aleatório
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 mt-6 border-b border-purple-200 sticky top-[140px] bg-white/95 backdrop-blur-md px-6 py-5 z-25 gap-4 rounded-2xl shadow-lg mx-2 sm:mx-0">
          <div className="text-sm text-gray-600 font-medium">
            Mostrando {displayedThoughts.length} de {filteredThoughts.length}{" "}
            pensamentos
            {filteredThoughts.length !== allThoughts.length && (
              <span className="text-blue-600">
                {" "}
                (filtrados de {allThoughts.length} no total)
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={scrollToTop}
              className="px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none rounded-xl text-sm cursor-pointer hover:from-purple-700 hover:to-blue-700 active:scale-95 transition-all duration-200 shadow-md"
            >
              ↑ Voltar ao Topo
            </button>
            {hasMore && (
              <button
                onClick={loadAllRemaining}
                className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none rounded-xl text-sm cursor-pointer hover:from-emerald-600 hover:to-green-600 active:scale-95 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                disabled={loadingMore}
              >
                {loadingMore ? "⏳ Carregando..." : "⚡ Carregar Tudo"}
              </button>
            )}
            {(searchTerm || filterCategory !== "all") && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white border-none rounded-xl text-sm cursor-pointer hover:from-pink-600 hover:to-red-600 active:scale-95 transition-all duration-200 shadow-md"
              >
                ✕ Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Featured thought */}
        {selectedThought && (
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white rounded-2xl shadow-xl border border-white/20">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              ⭐ Pensamento em Destaque
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
              ⬇️ Puxe para baixo para atualizar
            </h3>
          }
          releaseToRefreshContent={
            <h3 className="text-center text-gray-600 py-4">
              ⬆️ Solte para atualizar
            </h3>
          }
          scrollThreshold={0.8}
          style={{ overflow: "visible" }}
        >
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-8">
            {displayedThoughts.map((thought, index) => (
              <div key={`${thought.id}-${index}`} className="break-inside-avoid mb-6">
                <ThoughtCard
                  thought={thought}
                  isActive={selectedThought?.id === thought.id}
                  onClick={() => handleThoughtClick(thought)}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>


        {/* No results */}
        {filteredThoughts.length === 0 && !loading && (
          <div className="text-center p-12 bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-200 my-8 shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg mb-4">
              Nenhum pensamento encontrado com seus critérios.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white border-none rounded-xl text-sm cursor-pointer hover:from-pink-600 hover:to-red-600 active:scale-95 transition-all duration-200 shadow-md"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
