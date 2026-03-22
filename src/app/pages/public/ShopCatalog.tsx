import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Search, Star, MapPin, Phone, Mail, Facebook, Instagram, ShoppingBag, Store, ChevronRight, Twitter } from "lucide-react";
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

  // Popular products (top 2 by rating/reviews or just first 2)
  const popularProducts = [...shopProducts]
    .sort((a, b) => ((b.rating || 0) * (b.reviewCount || 0)) - ((a.rating || 0) * (a.reviewCount || 0)))
    .slice(0, 2);

  const filtered = shopProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
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
      {/* Top Header - Brelness */}
      <div className="bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center sm:justify-between">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShoppingBag size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-wide">Brelness</span>
          </div>
          <p className="hidden sm:block text-xs text-gray-400">Plateforme de gestion pour PME & Startups</p>
        </div>
      </div>

      {/* Second Header - Shop Info */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-700 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer" onClick={() => setShowCatalog(false)}>
              {shop.logo ? (
                <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <Store size={24} className="text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight cursor-pointer" onClick={() => setShowCatalog(false)}>{shop.name}</h1>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wider">{shop.category}</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2 md:gap-4 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
            <button 
              onClick={() => {
                setShowCatalog(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-xl transition-all whitespace-nowrap shadow-sm"
              style={{ borderRadius: '12px' }}
            >
              {isService ? "Nos Services" : "Nos Produits"}
            </button>
            <button onClick={() => { setShowCatalog(false); setTimeout(() => scrollToSection('contact'), 50); }} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-xl transition-all whitespace-nowrap" style={{ borderRadius: '12px' }}>
              Contact
            </button>
            <button onClick={() => { setShowCatalog(false); setTimeout(() => scrollToSection('social'), 50); }} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-xl transition-all whitespace-nowrap" style={{ borderRadius: '12px' }}>
              Communautés
            </button>
          </nav>
        </div>
      </header>

      {!showCatalog && (
        <>
          {/* Hero Section */}
          <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
            {slides.map((img: string, idx: number) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              >
                <img src={img} alt="Hero" className="w-full h-full object-cover" />
              </div>
            ))}
            {/* Dark Transparent Overlay */}
            <div className="absolute inset-0 bg-black/60 z-20" />
            
            <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
                {shop.heroTitle || `Bienvenue chez ${shop.name}`}
              </h2>
              {shop.description && (
                <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium drop-shadow-md">
                  {shop.description}
                </p>
              )}
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
                   className="bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                 >
                   <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                     {product.images && product.images.length > 0 ? (
                       <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={48} className="text-gray-400" /></div>
                     )}
                   </div>
                   <div className="p-6">
                     <p className="font-bold text-lg text-gray-900 dark:text-white mb-2">{product.name}</p>
                     <div className="flex items-center justify-between">
                       <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-xl">{product.price.toLocaleString("fr")} FCFA</span>
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
                </div>
              </div>

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
                  <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm mx-auto">Nous n'avons trouvé aucun {isService ? "service" : "produit"} correspondant à votre recherche.</p>
                  <button onClick={() => { setSearch(""); setFilterCat("all"); }} className="mt-6 px-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors">
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {filtered.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.shareCode || product.id}`}
                      className="flex flex-col group"
                    >
                      <div className="relative h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden mb-5 shadow-sm group-hover:shadow-xl transition-all duration-300">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={48} className="text-gray-300" /></div>
                        )}
                        
                        <div className="absolute inset-x-4 bottom-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="px-4 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur text-blue-600 dark:text-blue-400 font-bold rounded-xl text-sm shadow-lg w-full text-center">
                            Découvrir
                          </span>
                        </div>
                      </div>
                      <div className="px-2">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-extrabold text-gray-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{product.name}</h4>
                        </div>
                        <p className="font-bold text-gray-500 dark:text-gray-400 text-sm mt-1">{product.price.toLocaleString("fr")} FCFA</p>
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
                    <MapPin size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>{shop.address}</span>
                  </div>
                )}
                {shop.phone && (
                  <a href={`tel:${shop.phone}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 transition-colors">
                    <Phone size={18} className="text-indigo-500 flex-shrink-0" />
                    <span>{shop.phone}</span>
                  </a>
                )}
                {shop.email && (
                  <a href={`mailto:${shop.email}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 transition-colors">
                    <Mail size={18} className="text-indigo-500 flex-shrink-0" />
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
              <a href="https://brelness.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:gap-3 transition-all">
                Créer sa boutique <ChevronRight size={16} />
              </a>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-gray-400">
              <ShoppingBag size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">Brelness</span>
            </div>
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} Brelness. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
