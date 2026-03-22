import { useState, useEffect } from "react";
import { Search, Plus, CheckCircle, XCircle, Edit2, Trash2, Eye } from "lucide-react";
import api from "../../api";

const CATEGORIES: string[] = ["vêtements", "cosmétiques", "électronique", "bijoux", "chaussures"];

function ShopModal({ shop, onClose, onSave }: { shop: any | null; onClose: () => void; onSave: (s: any) => void }) {
  const [form, setForm] = useState({ 
    name: shop?.name || "", 
    slug: shop?.slug || "",
    category: shop?.category || "", 
    businessType: shop?.businessType || "produits",
    description: shop?.description || "", 
    email: shop?.email || "", 
    phone: shop?.phone || "", 
    address: shop?.address || "",
    heroTitle: shop?.heroTitle || ""
  });

  const generateSlug = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const handleNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      name,
      slug: shop?.id ? f.slug : generateSlug(name)
    }));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-gray-900 dark:text-white">{shop?.id ? "Modifier la boutique" : "Nouvelle boutique"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Nom de la boutique</label>
              <input value={form.name} onChange={e => handleNameChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Sous-domaine (URL)</label>
              <div className="flex items-center gap-2">
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: generateSlug(e.target.value) }))} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="nom-boutique" />
                <span className="text-sm text-gray-400">.brelness.com</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 italic">URL finale : https://{form.slug || "..."}.brelness.com</p>
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Catégorie</label>
              <input list="categories" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="ex: Startup, Cosmétiques..." className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <datalist id="categories">
                {CATEGORIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Type d'Entreprise</label>
              <select value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="produits">Vente de Produits</option>
                <option value="services">Vente de Services (PME/Startup)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Téléphone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Adresse</label>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Titre d'Accueil (Section Héro)</label>
              <input value={form.heroTitle} onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Le meilleur de nos produits..." />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Annuler</button>
          <button onClick={() => onSave({ ...shop, ...form })} className="px-4 py-2 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

export default function SAShops() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterCat, setFilterCat] = useState<"all" | string>("all");
  const [modalShop, setModalShop] = useState<any | null | "new">(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/shops'); // GET /shops gets all shops for SuperAdmin (Wait, ShopsController mapped it to GET /shops/)
      setShops(data);
    } catch (err) {
      console.error("Error fetching shops", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const filtered = shops.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.users?.[0]?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const matchCat = filterCat === "all" || s.category === filterCat;
    return matchSearch && matchStatus && matchCat;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSave = async (s: any) => {
    try {
      if (s.id) {
        await api.patch(`/shops/${s.id}`, {
          name: s.name,
          slug: s.slug,
          category: s.category,
          businessType: s.businessType,
          description: s.description,
          email: s.email,
          phone: s.phone,
          address: s.address,
          heroTitle: s.heroTitle,
        });
      } else {
        await api.post(`/shops`, {
          name: s.name,
          slug: s.slug,
          category: s.category,
          businessType: s.businessType,
          description: s.description,
          email: s.email,
          phone: s.phone,
          address: s.address,
          heroTitle: s.heroTitle,
        });
      }
      setModalShop(null);
      fetchShops();
    } catch (err) {
      console.error("Error saving shop", err);
      alert("Erreur lors de la sauvegarde de la boutique.");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await api.patch(`/shops/${id}/toggle-status`);
      fetchShops();
    } catch (err) {
      console.error("Error toggling shop status", err);
    }
  };

  const deleteShop = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette boutique ? Toutes les données associées seront perdues.")) {
      try {
        await api.delete(`/shops/${id}`);
        fetchShops();
      } catch (err) {
        console.error("Error deleting shop", err);
      }
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Boutiques</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{shops.length} boutiques enregistrées</p>
        </div>
        <button onClick={() => setModalShop("new")} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm transition-colors">
          <Plus size={16} />Nouvelle boutique
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher une boutique…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as any); setPage(1); }} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Tous les statuts</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select value={filterCat} onChange={e => { setFilterCat(e.target.value as any); setPage(1); }} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Toutes catégories</option>
          {Array.from(new Set(shops.map(s => s.category).filter(Boolean))).map(c => (
            <option key={String(c)} value={String(c)}>{String(c)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                {["Boutique", "Catégorie", "Responsable", "Licence", "Statut", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">Aucune boutique trouvée</td></tr>
              ) : paginated.map(shop => (
                <tr key={shop.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        {shop.logo ? <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">{shop.name.charAt(0)}</div>}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{shop.name}</p>
                        <p className="text-xs text-gray-400">{shop.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400 capitalize">{shop.category}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">{shop.users?.length > 0 ? shop.users[0].name : "Non assigné"}</td>
                  <td className="px-5 py-3.5">
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${shop.license?.status === "Actif" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : shop.license?.status === "Expiré" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
                        {shop.license?.status === "Actif" ? <CheckCircle size={9} /> : <XCircle size={9} />}
                        {shop.license?.type || "Basic"}
                      </span>
                      {shop.license?.endDate && <p className="text-xs text-gray-400 mt-0.5">jusqu'au {new Date(shop.license.endDate).toLocaleDateString("fr")}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleStatus(shop.id)} className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${shop.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200"}`}>
                      {shop.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-5 py-3.5 relative">
                    <div className="flex items-center gap-1">
                      <a href={`/shop/${shop.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors" title="Voir"><Eye size={15} /></a>
                      <button onClick={() => setModalShop(shop)} className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" title="Modifier"><Edit2 size={15} /></button>
                      <button onClick={() => deleteShop(shop.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > PER_PAGE && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">{filtered.length} résultats · Page {page} / {Math.ceil(filtered.length / PER_PAGE)}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">Précédent</button>
              <button onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / PER_PAGE), p + 1))} disabled={page >= Math.ceil(filtered.length / PER_PAGE)} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">Suivant</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalShop !== null && (
        <ShopModal
          shop={modalShop === "new" ? {} : modalShop}
          onClose={() => setModalShop(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}