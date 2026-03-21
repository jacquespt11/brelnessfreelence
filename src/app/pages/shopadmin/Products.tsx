import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit2, Trash2, Share2, Star, AlertTriangle, Package, Copy, CheckCircle, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import api from "../../api";

const CATEGORIES = ["Robes", "Vestes", "Soins Visage", "Soins Corps", "Audio", "Colliers", "Sneakers", "Autre"];

function ProductModal({ product, shopId, businessType, onClose, onSave }: any) {
  const isService = businessType === "services";
  const itemName = isService ? "service" : "produit";
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    name: product?.name || "", description: product?.description || "", price: product?.price || "", category: product?.category || "Autre",
    stock: product?.stock || 0, status: product?.status || "active", tags: product?.tags?.join(", ") || "",
  });
  
  const [images, setImages] = useState<string[]>(product?.images || []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const upRes = await api.post('/upload', { filename: file.name, data: base64 });
        setImages(prev => [...prev, upRes.data.url]);
      } catch (err) {
        alert("Erreur lors de l'upload de l'image.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-gray-900 dark:text-white">{product?.id ? `Modifier le ${itemName}` : `Nouveau ${itemName}`}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Nom du {itemName} *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Prix (FCFA) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">{isService ? "Capacité d'accueil / Quotas" : "Stock disponible"}</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Catégorie</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Statut</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Tags (séparés par virgule)</label>
            <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="ex: été, floral, tendance" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Images du {itemName}</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group">
                  <img src={img} alt="Aperçu" className="w-full h-full object-cover" />
                  <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Package size={24} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Cliquez ici pour rajouter une image</p>
              <p className="text-xs text-gray-300 dark:text-gray-500 mt-1">JPG, PNG, WebP · max 5MB</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Annuler</button>
          <button onClick={() => onSave({ ...product, ...form, tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean), images, shopId })} className="px-4 py-2 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 text-white transition-colors">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

function ShareModal({ product, onClose }: { product: any; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  // The share code is the actual ID now, assuming we use ID for public links
  const shareUrl = `https://brelness.com/product/${product.id}`;
  const copy = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const shareLinks = [
    { label: "Facebook", color: "bg-blue-600", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: "WhatsApp", color: "bg-green-500", url: `https://wa.me/?text=${encodeURIComponent(product.name + " - " + shareUrl)}` },
    { label: "Twitter/X", color: "bg-black", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(product.name)}` },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-gray-900 dark:text-white">Partager le produit</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{product.price.toLocaleString("fr")} FCFA</p>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Lien de partage</label>
            <div className="flex gap-2">
              <input readOnly value={shareUrl} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs focus:outline-none" />
              <button onClick={copy} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${copied ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-200"}`}>
                {copied ? <><CheckCircle size={12} />Copié!</> : <><Copy size={12} />Copier</>}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">Partager sur</label>
            <div className="grid grid-cols-3 gap-2">
              {shareLinks.map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer"
                  className={`${link.color} text-white rounded-xl py-2 text-center text-xs font-medium hover:opacity-90 transition-opacity`}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopProducts() {
  const { currentUser } = useApp();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [modalProduct, setModalProduct] = useState<any | null | "new">(null);
  const [shareProduct, setShareProduct] = useState<any | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const [shopSlug, setShopSlug] = useState("");
  const [businessType, setBusinessType] = useState("produits");

  const fetchProducts = async () => {
    if (!currentUser?.shopId) return;
    try {
      setLoading(true);
      const res = await api.get(`/products/shop/${currentUser.shopId}`);
      setProducts(res.data);
      // Hack to get the shop slug and business Type for sharing links easily for now
      if (res.data.length > 0 && res.data[0].shop) {
        setShopSlug(res.data[0].shop.slug);
        setBusinessType(res.data[0].shop.businessType || "produits");
      } else {
        // fetch shop to get businessType if there are no products
        await api.get(`/shops/me/shop`).then(r => setBusinessType(r.data.businessType || "produits")).catch(console.error);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentUser]);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

    const handleSave = async (p: any) => {
    try {
      if (p.id) {
        await api.patch(`/products/${p.id}`, {
          name: p.name,
          description: p.description,
          price: Number(p.price),
          stock: Number(p.stock),
          category: p.category,
          tags: p.tags,
          images: p.images
        });
      } else {
        await api.post(`/products`, {
          name: p.name,
          description: p.description,
          price: Number(p.price),
          stock: Number(p.stock),
          category: p.category,
          tags: p.tags,
          images: p.images
        });
      }
      setModalProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
      alert("Erreur lors de la sauvegarde du produit.");
    }
  };

  const deleteProduct = async (id: string) => { 
    if (confirm("Supprimer ce produit ?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product", err);
      }
    }
  };

  const isService = businessType === "services";
  const itemsName = isService ? "Services" : "Produits";
  const itemName = isService ? "service" : "produit";

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">{itemsName}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{products.length} {itemName}s dans votre boutique</p>
        </div>
        <button onClick={() => setModalProduct("new")} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm transition-colors">
          <Plus size={16} />Nouveau {itemName}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Rechercher un ${itemName}…`} className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
          <option value="all">Tous</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
        <div className="flex gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
          <button onClick={() => setView("grid")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === "grid" ? "bg-violet-600 text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}>Grille</button>
          <button onClick={() => setView("list")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === "list" ? "bg-violet-600 text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}>Liste</button>
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
              <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {product.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </div>
                {product.stock <= 5 && (
                  <div className="absolute top-2 left-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">
                      <AlertTriangle size={10} />Stock faible
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{product.price.toLocaleString("fr")} F</span>
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star size={11} fill="currentColor" />
                    <span className="text-gray-600 dark:text-gray-400">{product.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Stock: {product.stock}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setShareProduct(product)} className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"><Share2 size={13} /></button>
                    <button onClick={() => setModalProduct(product)} className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"><Edit2 size={13} /></button>
                    <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50">
                {[isService ? "Service" : "Produit", "Catégorie", "Prix", isService ? "Capacité" : "Stock", "Réservations", "Note", "Statut", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{product.price.toLocaleString("fr")} F</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${product.stock <= 5 ? "text-amber-600 font-medium" : "text-gray-600 dark:text-gray-400"}`}>{product.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{product.reservationCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`}>
                      Actif
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShareProduct(product)} className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"><Share2 size={14} /></button>
                      <button onClick={() => setModalProduct(product)} className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Package size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Aucun {itemName} trouvé</p>
        </div>
      )}

      {modalProduct !== null && (
        <ProductModal
          product={modalProduct === "new" ? null : modalProduct}
          shopId={currentUser?.shopId}
          businessType={businessType}
          onClose={() => setModalProduct(null)}
          onSave={handleSave}
        />
      )}
      {shareProduct && <ShareModal product={shareProduct} onClose={() => setShareProduct(null)} />}
    </div>
  );
}
