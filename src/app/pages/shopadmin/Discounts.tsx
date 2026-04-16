import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag, Percent, RefreshCw, X } from "lucide-react";
import api from "../../api";
import toast from "react-hot-toast";

export default function Discounts() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: 0,
    minAmount: "",
    maxUses: "",
    expiresAt: "",
    isActive: true,
  });

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/discounts");
      setDiscounts(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Le code promo est requis");
      return;
    }
    if (form.value <= 0) {
      toast.error("La valeur de réduction doit être positive");
      return;
    }
    
    // Ensure uppercase code
    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minAmount: form.minAmount ? Number(form.minAmount) : undefined,
      maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await api.patch(`/discounts/${editingId}`, payload);
        toast.success("Code promo modifié");
      } else {
        await api.post("/discounts", payload);
        toast.success("Code promo créé");
      }
      setShowModal(false);
      resetForm();
      fetchDiscounts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur d'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce code promo ?")) return;
    try {
      await api.delete(`/discounts/${id}`);
      toast.success("Code supprimé");
      setDiscounts(d => d.filter(x => x.id !== id));
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const toggleStatus = async (discount: any) => {
    try {
      const res = await api.patch(`/discounts/${discount.id}`, { isActive: !discount.isActive });
      setDiscounts(d => d.map(x => x.id === discount.id ? res.data : x));
      toast.success(res.data.isActive ? "Code activé" : "Code désactivé");
    } catch (err) {
      toast.error("Erreur");
    }
  };

  const resetForm = () => {
    setForm({
      code: "",
      type: "PERCENT",
      value: 0,
      minAmount: "",
      maxUses: "",
      expiresAt: "",
      isActive: true,
    });
    setEditingId(null);
  };

  const openEdit = (d: any) => {
    setForm({
      code: d.code,
      type: d.type,
      value: d.value,
      minAmount: d.minAmount || "",
      maxUses: d.maxUses || "",
      expiresAt: d.expiresAt ? d.expiresAt.substring(0, 16) : "",
      isActive: d.isActive,
    });
    setEditingId(d.id);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Codes Promo</h1>
          <p className="text-gray-500 dark:text-gray-400">Gérez vos codes de réduction et offres marketing.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm"
        >
          <Plus size={16} />
          Nouveau code
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Code</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Réduction</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Conditions</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Utilisations</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Chargement...</td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Aucun code promo créé. <button onClick={() => setShowModal(true)} className="text-blue-500 hover:underline">Créez-en un</button>
                  </td>
                </tr>
              ) : discounts.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold tracking-wider text-gray-900 dark:text-white px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {d.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {d.type === 'PERCENT' ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium"><Percent size={14} /> {d.value}%</span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium"><Tag size={14} /> {d.value.toLocaleString()} FC</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs space-y-1">
                    {d.minAmount ? <p>Min: {d.minAmount.toLocaleString()} FC</p> : <p>Pas de min</p>}
                    {d.expiresAt ? <p>Exp: {new Date(d.expiresAt).toLocaleDateString()}</p> : <p>Expir: Jamais</p>}
                  </td>
                  <td className="px-6 py-4">
                    {d.usedCount} {d.maxUses ? `/ ${d.maxUses}` : "utilisations"}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(d)} className={`px-2 py-1 rounded-full text-xs font-medium border transition-colors ${d.isActive ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 hover:bg-green-100' : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100'}`}>
                      {d.isActive ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(d)} className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingId ? "Modifier le code promo" : "Nouveau code promo"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Code promo *</label>
                  <input type="text" maxLength={15} value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} placeholder="ex: NOEL2026, SUMMER25" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono tracking-wide" required />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Type de réduction</label>
                  <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="PERCENT">Pourcentage (%)</option>
                    <option value="FIXED">Montant Fixe (FC)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Valeur *</label>
                  <div className="relative">
                    <input type="number" min="1" value={form.value || ""} onChange={e => setForm(f => ({...f, value: Number(e.target.value)}))} className="w-full pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{form.type === "PERCENT" ? "%" : "F"}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Montant min achat (Optionnel)</label>
                  <input type="number" min="0" placeholder="ex: 10000" value={form.minAmount} onChange={e => setForm(f => ({...f, minAmount: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Utilisations max (Optionnel)</label>
                  <input type="number" min="1" placeholder="ex: 100 (pour 100 1ers clients)" value={form.maxUses} onChange={e => setForm(f => ({...f, maxUses: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Date d'expiration (Optionnel)</label>
                  <input type="datetime-local" value={form.expiresAt} onChange={e => setForm(f => ({...f, expiresAt: e.target.value}))} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="col-span-2 flex items-center gap-3 mt-2">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({...f, isActive: e.target.checked}))} className="w-4 h-4 text-blue-600 rounded" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">Code actif (utilisable immédiatement)</label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition-colors font-medium">Annuler</button>
                <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
