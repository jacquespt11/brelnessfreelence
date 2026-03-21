import { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, ThumbsUp, Search, Filter } from "lucide-react";
import { useApp } from "../../context/AppContext";
import api from "../../api";

export interface Review {
  id: string;
  shopId: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  isModerated: boolean;
  helpful: number;
  createdAt: string;
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} className={i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-gray-600"} />
      ))}
    </div>
  );
}

export default function ShopReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterModerated, setFilterModerated] = useState<"all" | "moderated" | "pending">("all");
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews/shop');
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reviews.filter(r => {
    const matchSearch = (r.product?.name || "").toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    const matchModerated = filterModerated === "all" || (filterModerated === "moderated" && r.status === "published") || (filterModerated === "pending" && r.status === "hidden");
    const matchRating = filterRating === "all" || r.rating === filterRating;
    return matchSearch && matchModerated && matchRating;
  });

  const toggleStatus = async (id: string) => {
    try {
      await api.patch(`/reviews/${id}/toggle-status`);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const ratingDist = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    pct: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-gray-900 dark:text-white">Avis clients</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{reviews.length} avis · {reviews.filter(r => !r.isModerated).length} en attente de modération</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Note globale</p>
          <p className="text-5xl font-bold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</p>
          <Stars rating={Math.round(avgRating)} size={18} />
          <p className="text-xs text-gray-500 dark:text-gray-400">{reviews.length} avis</p>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Répartition des notes</p>
          <div className="space-y-2">
            {ratingDist.map(({ rating, count, pct }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-4 text-right">{rating}</span>
                <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-4">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un avis…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <select value={filterModerated} onChange={e => setFilterModerated(e.target.value as any)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none">
          <option value="all">Tous les avis</option>
          <option value="pending">En attente</option>
          <option value="moderated">Approuvés</option>
        </select>
        <select value={filterRating} onChange={e => setFilterRating(e.target.value === "all" ? "all" : Number(e.target.value))} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none">
          <option value="all">Toutes les notes</option>
          {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} étoile{r > 1 ? "s" : ""}</option>)}
        </select>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <Star size={40} className="text-gray-200 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Aucun avis trouvé</p>
          </div>
        ) : filtered.map(review => (
            <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border transition-all ${review.status === "published" ? "border-gray-100 dark:border-gray-700" : "border-amber-200 dark:border-amber-800"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {("Client").charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Client Brelness</p>
                      <div className="flex items-center gap-2">
                        <Stars rating={review.rating} size={12} />
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("fr")}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">→ {review.product?.name || "Boutique"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-violet-500 transition-colors">
                      <ThumbsUp size={12} />Utile (0)
                    </button>
                    {review.status !== "published" && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium">
                        Visibilité désactivée
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {review.status !== "published" ? (
                    <>
                      <button onClick={() => toggleStatus(review.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 transition-colors">
                        <CheckCircle size={12} />Rendre visible
                      </button>
                    </>
                  ) : (
                    <button onClick={() => toggleStatus(review.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors">
                      <XCircle size={12} />Masquer
                    </button>
                  )}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
