import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Search, Star, MapPin, Phone, Mail, Facebook, Instagram, ShoppingBag, Filter, Store } from "lucide-react";
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

  useEffect(() => {
    const fetchCatalog = async () => {
      if (!shopSlug) return;
      try {
        setLoading(true);
        // 1. Fetch shop info
        const shopRes = await api.get(`/shops/by-slug/${shopSlug}`);
        const shopData = shopRes.data;
        setShop(shopData);
        
        // 2. Fetch products for this shop
        // Assuming we need only active, but we can filter on frontend or backend
        const prodRes = await api.get(`/products/shop/${shopData.id}`);
        setShopProducts(prodRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Boutique introuvable");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [shopSlug]);

  const categories = ["all", ...Array.from(new Set(shopProducts.map(p => p.category || "Autre")))];

  const filtered = shopProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShoppingBag size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Brelness</span>
          </div>
        </div>
      </header>

      {/* Shop banner */}
      <div className="relative">
        <div className="h-48 lg:h-64 overflow-hidden bg-indigo-100 dark:bg-indigo-900">
          {shop.banner ? (
            <img src={shop.banner} alt={shop.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-6xl mx-auto px-4 pb-6 flex items-end gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-white dark:bg-gray-800 flex items-center justify-center">
              {shop.logo ? (
                <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <Store size={32} className="text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-white" style={{ fontSize: "1.5rem" }}>{shop.name}</h1>
              <p className="text-white/80 text-sm capitalize">{shop.category}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Shop info bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {shop.address && (
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
                <MapPin size={14} className="text-indigo-500" />
                {shop.address}
              </div>
            )}
            {shop.phone && (
              <a href={`tel:${shop.phone}`} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 transition-colors">
                <Phone size={14} className="text-indigo-500" />
                {shop.phone}
              </a>
            )}
            {shop.email && (
              <a href={`mailto:${shop.email}`} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 transition-colors">
                <Mail size={14} className="text-indigo-500" />
                {shop.email}
              </a>
            )}
          </div>
          <div className="flex gap-2">
            {shop.facebook && <a href={shop.facebook} target="_blank" className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors"><Facebook size={16} /></a>}
            {shop.instagram && <a href={shop.instagram} target="_blank" className="p-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-100 transition-colors"><Instagram size={16} /></a>}
          </div>
        </div>

        {/* Description */}
        {shop.description && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">{shop.description}</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${filterCat === cat ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              >
                {cat === "all" ? "Tous" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={48} className="text-gray-200 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.shareCode || product.id}`}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <ShoppingBag size={48} className="text-gray-300" />
                  )}
                  {product.stock <= 5 && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Stock limité</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{product.description || "Aucune description"}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{product.price.toLocaleString("fr")} FCFA</span>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star size={11} fill="currentColor" />
                      <span className="text-gray-600 dark:text-gray-400">{product.rating || "0"} ({product.reviewCount || "0"})</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl transition-colors">
                    Réserver
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
        <p className="text-center text-xs text-gray-400">Propulsé par <span className="text-indigo-600 font-medium">Brelness</span> · Plateforme SaaS de gestion de boutiques</p>
      </footer>
    </div>
  );
}
