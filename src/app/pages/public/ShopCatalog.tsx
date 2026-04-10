import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Search, Star, MapPin, Phone, Mail, Facebook, Instagram, ShoppingBag, Store, ChevronRight, Twitter, SlidersHorizontal, X } from "lucide-react";
import api from "../../api";
import { getSubdomain } from "../../utils/subdomain";

export default function ShopCatalog() {
  const { shopSlug: paramSlug } = useParams<{ shopSlug: string }>();
  const subdomain = getSubdomain();
  const shopSlug = paramSlug || subdomain;

  const [shop, setShop] = useState<any>(null);
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [showCatalog, setShowCatalog] = useState(false);

  // New Filters Option D
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({ min: "", max: "" });
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("relevance");

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchCatalog = async () => {
      if (!shopSlug) return;
      try {
        setLoading(true);
        const shopRes = await api.get(`/shops/by-slug/${shopSlug}`);
        setShop(shopRes.data);
        
        const prodRes = await api.get(`/products/shop/${shopRes.data.id}`);
        setShopProducts(prodRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Boutique introuvable");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [shopSlug]);

  useEffect(() => {
    if (shop?.heroImages?.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % shop.heroImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [shop?.heroImages]);

  const categories = ["all", ...Array.from(new Set(shopProducts.map(p => p.category || "Autre")))];
  const availableTags = Array.from(new Set(shopProducts.flatMap(p => p.tags || [])));

  // Popular products (top 2 by rating/reviews or just first 2)
  const popularProducts = [...shopProducts]
    .sort((a, b) => ((b.rating || 0) * (b.reviewCount || 0)) - ((a.rating || 0) * (a.reviewCount || 0)))
    .slice(0, 2);

  let filtered = shopProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    
    // Filtre de prix
    const pMin = priceRange.min ? parseFloat(priceRange.min) : 0;
    const pMax = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchPrice = p.price >= pMin && p.price <= pMax;

    // Filtre de Disponibilité
    const matchStock = onlyInStock ? p.stock > 0 : true;

    // Filtre de Tags (Intersection)
    const matchTags = selectedTags.length === 0 || selectedTags.every(tag => (p.tags || []).includes(tag));

    return matchSearch && matchCat && matchPrice && matchStock && matchTags;
  });

  // Tri de la liste filtrée
  filtered = filtered.sort((a, b) => {
    switch (sortBy) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "rating": 
        const aScore = (a.rating || 0) * (a.reviewCount || 1);
        const bScore = (b.rating || 0) * (b.reviewCount || 1);
        return bScore - aScore;
      case "relevance":
      default:
        return 0;
    }
  });

  const activeFiltersCount = (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0) + (onlyInStock ? 1 : 0) + selectedTags.length + (sortBy !== 'relevance' ? 1 : 0);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">
        {error}
      </div>
    );
  }

  const defaultHero = shop.banner ? [shop.banner] : ["https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070"];
  const slides = shop.heroImages?.length > 0 ? shop.heroImages : defaultHero;
  const isService = shop.businessType === 'services';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

      {/* ── Barre Brelness (Top) ───────────────────────────────────── */}
      <div
        style={{ background: "linear-gradient(90deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)" }}
        className="w-full"
      >
        <div className="max-w-7xl mx-auto px-5 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md overflow-hidden flex-shrink-0">
              <img src="/logoBrelness.png" alt="Brelness" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-extrabold text-xs tracking-widest uppercase">Brelness O.S</span>
          </div>
          <p className="hidden sm:block text-indigo-300 text-[10px] font-semibold tracking-widest uppercase">
            Plateforme SaaS · Gestion boutiques &amp; réservations
          </p>
          <div className="w-5 h-5" />{/* spacer */}
        </div>
      </div>

      {/* ── Header Boutique Sticky ─────────────────────────────────── */}
      <header className="sticky top-0 z-[999] w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl border-b border-gray-100 dark:border-gray-800 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between gap-4">

          {/* Logo boutique + nom */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowCatalog(false)}
          >
            <div className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 shadow-md border border-gray-100 dark:border-gray-700 group-hover:scale-105 transition-transform duration-200">
              {shop.logo ? (
                <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900 dark:to-blue-950 flex items-center justify-center">
                  <Store size={20} className="text-indigo-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-base font-black text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {shop.name}
              </h1>
              <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.15em] leading-none">
                {shop.category}
              </p>
            </div>
          </div>

          {/* Navigation centre */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => { setShowCatalog(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all whitespace-nowrap shadow-md hover:shadow-indigo-300/40 dark:hover:shadow-indigo-900/40 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
            >
              {isService ? "Nos Services" : "Notre Collection"}
            </button>
            <button
              onClick={() => { setShowCatalog(false); setTimeout(() => scrollToSection('contact'), 50); }}
              className="px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all whitespace-nowrap"
            >
              Contact
            </button>
          </nav>

          {/* Mobile nav */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => { setShowCatalog(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-4 py-2 text-xs font-bold text-white rounded-xl"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
            >
              {isService ? "Services" : "Catalogue"}
            </button>
            <button
              onClick={() => { setShowCatalog(false); setTimeout(() => scrollToSection('contact'), 50); }}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
            >
              Contact
            </button>
          </div>
        </div>
      </header>

      {!showCatalog && (
        <>
          {/* Premium Hero Section */}
          <section className="relative h-[55vh] md:h-[65vh] min-h-[350px] md:min-h-[450px] flex items-center justify-center overflow-hidden bg-gray-900 shadow-2xl">
            {slides.map((img: string, idx: number) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${idx === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"}`}
              >
                <img src={img} alt="Hero" className="w-full h-full object-cover" />
              </div>
            ))}
            {/* Hero Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-black/60 z-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-20" />
            
            <div className="relative z-30 px-6 max-w-6xl mx-auto w-full flex flex-col justify-end h-full pb-10 md:pb-16">
              <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <span className="inline-block py-1 px-3 md:py-1.5 md:px-4 rounded-full bg-white/10 backdrop-blur-md text-white text-xs md:text-sm font-bold tracking-widest uppercase mb-4 md:mb-6 border border-white/20 shadow-xl">
                  {isService ? "Services Premium" : "Collection Exclusive"}
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-[1.1] drop-shadow-2xl">
                  {shop.heroTitle || shop.name}
                </h2>
                {shop.description && (
                  <p className="text-base md:text-xl lg:text-2xl text-white/80 leading-relaxed font-medium max-w-2xl drop-shadow-lg">
                    {shop.description}
                  </p>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      <main className="flex-1 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
          
          {/* Popular Section */}
          {!showCatalog && popularProducts.length > 0 && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:pr-8">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  Les plus populaires
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Découvrez les {isService ? "services" : "produits"} favoris de nos clients. Laissez-vous séduire par ce qui fait le succès de <span className="font-semibold text-gray-700 dark:text-gray-300">{shop.name}</span>.
                </p>
                <button 
                  onClick={() => {
                    setShowCatalog(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm group"
                  style={{ borderRadius: '12px' }}
                >
                  Voir tout le catalogue <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {popularProducts.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.shareCode || product.id}`}
                      className="bg-white dark:bg-gray-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative"
                    >
                      <div className="relative h-72 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={48} className="text-gray-300 dark:text-gray-600" /></div>
                        )}
                        {/* Hover Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out flex justify-center bg-gradient-to-t from-black/60 to-transparent">
                          <span className="px-6 py-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur text-gray-900 dark:text-white font-bold rounded-2xl text-sm shadow-xl w-full text-center hover:bg-gray-50 transition-colors">
                            {isService ? "Prendre RDV" : "Découvrir"}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-gray-900 dark:text-white text-xl">{product.price.toLocaleString("fr")} <span className="text-sm font-bold text-gray-400">FCFA</span></span>
                          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg text-xs font-bold">
                            <Star size={12} fill="currentColor" />
                            <span>{product.rating ? parseFloat(product.rating).toFixed(1) : "Nouveau"}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                ))}
              </div>
            </section>
          )}

          {/* Catalog Section */}
          {showCatalog && (
            <section id="catalog" className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Notre Catalogue</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Découvrez l'ensemble de nos {isService ? "services" : "produits"} avec nos nouveautés.</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[280px]">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom..." className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm" />
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-medium transition-all ${
                      showFilters || activeFiltersCount > 0 
                      ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-300" 
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <SlidersHorizontal size={18} />
                    Filtres {activeFiltersCount > 0 && <span className="flex items-center justify-center w-5 h-5 ml-1 bg-blue-600 text-white rounded-full text-xs font-bold">{activeFiltersCount}</span>}
                  </button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Filtres Avancés</h4>
                    <button onClick={() => {
                      setPriceRange({ min: "", max: "" });
                      setOnlyInStock(false);
                      setSelectedTags([]);
                      setSortBy("relevance");
                      setFilterCat("all");
                    }} className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                      Réinitialiser tout
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Plage de Prix (FCFA)</label>
                      <div className="flex items-center gap-3">
                        <input type="number" placeholder="Min" value={priceRange.min} onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                        <span className="text-gray-400">-</span>
                        <input type="number" placeholder="Max" value={priceRange.max} onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    {/* Stock */}
                    {!isService && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Disponibilité</label>
                        <button 
                          onClick={() => setOnlyInStock(!onlyInStock)}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border transition-all text-sm font-medium text-left ${
                            onlyInStock 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" 
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${onlyInStock ? "border-emerald-600" : "border-gray-400"}`}>
                            {onlyInStock && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
                          </div>
                          En stock uniquement
                        </button>
                      </div>
                    )}

                    {/* Sorting */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Trier par</label>
                      <select 
                        value={sortBy} 
                        onChange={e => setSortBy(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%226 9 12 15 18 9%22%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[position:right_1rem_center] bg-[size:1.2em_1.2em]"
                      >
                        <option value="relevance">Pertinence</option>
                        <option value="newest">Nouveautés</option>
                        <option value="price-asc">Prix (Croissant)</option>
                        <option value="price-desc">Prix (Décroissant)</option>
                        <option value="rating">Mieux notés</option>
                      </select>
                    </div>

                    {/* Tags */}
                    {availableTags.length > 0 && (
                      <div className="lg:col-span-full border-t border-gray-100 dark:border-gray-700 pt-6 mt-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tags Populaires</label>
                        <div className="flex flex-wrap gap-2">
                          {availableTags.map(tag => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => setSelectedTags(prev => isSelected ? prev.filter(t => t !== tag) : [...prev, tag])}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                  isSelected
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600"
                                }`}
                              >
                                {tag} {isSelected && <X size={12} className="inline ml-1 -mt-0.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border ${filterCat === cat ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"}`}
                  >
                    {cat === "all" ? "Toutes les catégories" : cat}
                  </button>
                ))}
              </div>

              {/* Products grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-24 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={24} className="text-gray-400" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun résultat trouvé</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm mx-auto">Nous n'avons trouvé aucun {isService ? "service" : "produit"} correspondant à vos filtres actuels.</p>
                  <button onClick={() => { 
                    setSearch(""); 
                    setFilterCat("all");
                    setPriceRange({ min: "", max: "" });
                    setOnlyInStock(false);
                    setSelectedTags([]);
                    setSortBy("relevance");
                  }} className="mt-6 px-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors">
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {filtered.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.shareCode || product.id}`}
                      className="flex flex-col group relative"
                    >
                      <div className="relative h-72 lg:h-80 bg-gray-100 dark:bg-gray-800 rounded-[32px] overflow-hidden mb-4 shadow-sm border border-black/5 dark:border-white/5 group-hover:shadow-2xl group-hover:shadow-blue-900/10 transition-all duration-500">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900"><ShoppingBag size={48} className="text-gray-300 dark:text-gray-700" /></div>
                        )}
                        
                        {/* Tags floating top */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {product.stock === 0 && !isService && (
                            <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur text-red-600 dark:text-red-400 font-bold rounded-full text-xs shadow-sm">Épuisé</span>
                          )}
                        </div>

                        {/* Hover Overlay Button */}
                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out flex justify-center bg-gradient-to-t from-black/50 to-transparent">
                          <span className="px-6 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur text-gray-900 dark:text-white font-bold rounded-2xl text-sm shadow-xl w-full text-center transition-colors">
                            {isService ? "Prendre RDV" : "Découvrir"}
                          </span>
                        </div>
                      </div>
                      <div className="px-3">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</h4>
                          <span className="font-black text-gray-900 dark:text-white text-lg bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg whitespace-nowrap">{product.price.toLocaleString("fr")} <span className="text-xs font-bold text-gray-500">FCFA</span></span>
                        </div>
                        <p className="font-medium text-gray-500 dark:text-gray-400 text-sm mt-0.5 line-clamp-1">{product.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 pt-16 pb-8 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Shop Info & Contact */}
            <div id="contact" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
                  {shop.logo ? <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" /> : <Store size={24} className="text-gray-400" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{shop.name}</h3>
              </div>
              
              <div className="space-y-3">
                {shop.address && (
                  <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm">
                    <MapPin size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{shop.address}</span>
                  </div>
                )}
                {shop.phone && (
                  <a href={`tel:${shop.phone}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm hover:text-blue-600 transition-colors">
                    <Phone size={18} className="text-blue-500 flex-shrink-0" />
                    <span>{shop.phone}</span>
                  </a>
                )}
                {shop.email && (
                  <a href={`mailto:${shop.email}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm hover:text-blue-600 transition-colors">
                    <Mail size={18} className="text-blue-500 flex-shrink-0" />
                    <span>{shop.email}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div id="social" className="scroll-mt-32">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Communautés</h4>
              <div className="flex flex-col gap-3">
                {shop.facebook && <a href={shop.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors text-sm font-medium"><Facebook size={18} /> Facebook</a>}
                {shop.instagram && <a href={shop.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-pink-600 transition-colors text-sm font-medium"><Instagram size={18} /> Instagram</a>}
                {shop.twitter && <a href={shop.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-sky-500 transition-colors text-sm font-medium"><Twitter size={18} /> Twitter</a>}
                {shop.tiktok && <a href={shop.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm font-medium"><span className="text-[10px] font-bold border-2 border-current rounded-sm px-1 py-0.5 leading-none">TK</span> TikTok</a>}
                
                {(!shop.facebook && !shop.instagram && !shop.twitter && !shop.tiktok) && (
                  <p className="text-gray-400 text-sm italic">Aucun réseau social lié à cette boutique.</p>
                )}
              </div>
            </div>

            {/* Brelness Static Info */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Plateforme</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                Brelness est la solution complète de gestion pour les PME et startups. Nous propulsons cette boutique avec notre technologie SaaS sécurisée et performante.
              </p>
              <a href="https://brelness.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold hover:gap-3 transition-all">
                Créer sa boutique <ChevronRight size={16} />
              </a>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-gray-400">
              <img src="/logoBrelness.png" alt="Brelness" className="w-4 h-4 object-contain opacity-50 grayscale hover:grayscale-0 transition-all" />
              <span className="text-xs font-bold uppercase tracking-widest">Brelness</span>
            </div>
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} Brelness. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
