import { useState, useEffect, type FormEvent } from "react";
import { useParams, Link } from "react-router";
import { Star, MapPin, Phone, Mail, ChevronLeft, ChevronRight, Share2, ThumbsUp, CheckCircle, AlertTriangle } from "lucide-react";
import api from "../../api";
import { getSubdomain } from "../../utils/subdomain";


function Stars({ rating, size = 14, interactive = false, onRate }: { rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={`${i <= (interactive ? hover || rating : rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-gray-600"} ${interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}`}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(i)}
        />
      ))}
    </div>
  );
}

export default function ProductPage() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const subdomain = getSubdomain();

  const [product, setProduct] = useState<any>(null);
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const shopUrl = subdomain ? "/" : shop ? `/shop/${shop.slug}` : "/";

  const [currentImg, setCurrentImg] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", quantity: 1, notes: "", agreed: false });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reviews functionality bypassed safely since Backend isn't fully implemented yet
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "", customerName: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const productReviews: any[] = []; // No reviews yet

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Product already includes the shop via the backend include: { shop: true }
        const prodRes = await api.get(`/products/${shareCode}`);
        const productData = prodRes.data;
        setProduct(productData);
        setShop(productData.shop || null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Produit introuvable");
      } finally {
        setLoading(false);
      }
    };
    if (shareCode) fetchProduct();
  }, [shareCode]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Le nom est requis";
    if (!form.phone.trim()) e.phone = "Le téléphone est requis";
    else if (!/^[\+\d\s\-()]{8,}$/.test(form.phone)) e.phone = "Numéro invalide";
    if (form.quantity < 1) e.quantity = "Quantité min : 1";
    if (form.quantity > product.stock) e.quantity = `Stock disponible : ${product.stock}`;
    if (!form.agreed) e.agreed = "Veuillez accepter les conditions";
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    setSubmitting(true);
    try {
      await api.post(`/reservations/shop/${shop.id}`, {
        productId: product.id,
        customerName: form.name,
        quantity: form.quantity,
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrors({ agreed: err.response?.data?.message || "Erreur de réservation" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (reviewForm.rating === 0) return;
    setReviewSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error || !product || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">
        {error || "Données manquantes"}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-gray-900 dark:text-white mb-2">Réservation confirmée !</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Merci <strong>{form.name}</strong> ! Votre réservation pour <strong>{product.name}</strong> (×{form.quantity}) a bien été enregistrée.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-left space-y-2 mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Contact boutique</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Phone size={13} className="text-indigo-500" />{shop.phone}
            </div>
            {shop.email && <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail size={13} className="text-indigo-500" />{shop.email}
            </div>}
          </div>
          <Link to={shopUrl} className="block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl font-medium transition-colors">
            Voir d'autres produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={shopUrl} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
            <ChevronLeft size={16} />
            <img src={shop.logo} alt={shop.name} className="w-6 h-6 rounded-lg object-cover" />
            {shop.name}
          </Link>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              <img src={product.images[currentImg] || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              {product.images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImg(i => (i - 1 + product.images.length) % product.images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-700/90 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white shadow-md transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setCurrentImg(i => (i + 1) % product.images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-700/90 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white shadow-md transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              {product.stock <= 5 && (
                <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  <AlertTriangle size={11} />Plus que {product.stock} en stock !
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setCurrentImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${currentImg === i ? "border-indigo-500" : "border-transparent"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info + form */}
          <div className="space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags?.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs">{tag}</span>
              ))}
            </div>

            <h1 className="text-gray-900 dark:text-white" style={{ fontSize: "1.5rem" }}>{product.name}</h1>

            <div className="flex items-center gap-3">
              <Stars rating={Math.round(product.rating)} size={16} />
              <span className="text-sm text-gray-500 dark:text-gray-400">{product.rating} · {product.reviewCount} avis</span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm">{product.description}</p>

            <div className="flex items-center justify-between py-3 border-y border-gray-100 dark:border-gray-700">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{product.price.toLocaleString("fr")} FCFA</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{product.stock} en stock</span>
            </div>

            {/* Reservation form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-3">
              <h3 className="text-gray-900 dark:text-white">Réserver ce produit</h3>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Nom complet *</label>
                <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }} placeholder="Votre nom complet" className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white ${errors.name ? "border-red-400 dark:border-red-600" : "border-gray-200 dark:border-gray-600"}`} />
                {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Téléphone *</label>
                  <input value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: "" })); }} placeholder="+225 07..." type="tel" className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white ${errors.phone ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`} />
                  {errors.phone && <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Quantité</label>
                  <input type="number" min={1} max={product.stock} value={form.quantity} onChange={e => { setForm(f => ({ ...f, quantity: Number(e.target.value) })); setErrors(er => ({ ...er, quantity: "" })); }} className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white ${errors.quantity ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`} />
                  {errors.quantity && <p className="text-xs text-red-500 mt-0.5">{errors.quantity}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Email (optionnel)</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="votre@email.com" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Notes spéciales (optionnel)</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Taille, couleur, instructions particulières…" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none" />
              </div>

              <div>
                <label className={`flex items-start gap-2 cursor-pointer ${errors.agreed ? "text-red-500" : "text-gray-600 dark:text-gray-400"}`}>
                  <input type="checkbox" checked={form.agreed} onChange={e => { setForm(f => ({ ...f, agreed: e.target.checked })); setErrors(er => ({ ...er, agreed: "" })); }} className="mt-0.5 accent-indigo-600" />
                  <span className="text-xs">J'accepte les <span className="underline text-indigo-600 cursor-pointer">conditions d'usage</span> et confirme ma réservation.</span>
                </label>
                {errors.agreed && <p className="text-xs text-red-500 mt-0.5">{errors.agreed}</p>}
              </div>

              <button type="submit" disabled={submitting} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <span className={`w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ${submitting ? "inline-block" : "hidden"}`} />
                {submitting ? "Envoi en cours…" : "Confirmer la réservation"}
              </button>
            </form>

            {/* Shop info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{shop.name}</p>
                  <Link to={shopUrl} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Voir le catalogue complet</Link>
                </div>
              </div>
              <div className="space-y-1.5">
                {shop.phone && <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"><Phone size={11} className="text-indigo-500" />{shop.phone}</div>}
                {shop.address && <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"><MapPin size={11} className="text-indigo-500" />{shop.address}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-10 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 dark:text-white">Avis clients ({productReviews.length})</h2>
            <button onClick={() => setShowReviewForm(s => !s)} className="px-4 py-2 rounded-xl text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">
              Laisser un avis
            </button>
          </div>

          {/* Review form */}
          {showReviewForm && !reviewSubmitted && (
            <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-indigo-100 dark:border-indigo-800 p-5 space-y-3">
              <h3 className="text-gray-900 dark:text-white">Votre avis</h3>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Note *</label>
                <Stars rating={reviewForm.rating} size={24} interactive onRate={r => setReviewForm(f => ({ ...f, rating: r }))} />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Votre commentaire *</label>
                <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} rows={3} required className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Nom (optionnel)</label>
                <input value={reviewForm.customerName} onChange={e => setReviewForm(f => ({ ...f, customerName: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button type="submit" disabled={reviewForm.rating === 0} className="px-5 py-2 rounded-xl text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors">
                Publier l'avis
              </button>
            </form>
          )}
          {reviewSubmitted && (
            <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <CheckCircle size={18} className="text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-400">Merci pour votre avis ! Il sera publié après modération.</p>
            </div>
          )}

          {/* Reviews list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {productReviews.length === 0 ? (
              <div className="lg:col-span-2 text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                Aucun avis pour ce produit. Soyez le premier !
              </div>
            ) : productReviews.map(review => (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{review.customerName}</p>
                      <Stars rating={review.rating} size={11} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("fr", { day: "numeric", month: "short" })}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                <button className="flex items-center gap-1.5 mt-2 text-xs text-gray-400 hover:text-indigo-500 transition-colors">
                  <ThumbsUp size={11} />Utile ({review.helpful})
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
        <p className="text-center text-xs text-gray-400">Propulsé par <span className="text-indigo-600 font-medium">Brelness</span></p>
      </footer>
    </div>
  );
}