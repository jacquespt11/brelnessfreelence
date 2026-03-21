import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, UserCheck, UserX } from "lucide-react";
import api from "../../api";

function AdminModal({ admin, shops, onClose, onSave }: { admin: any | null; shops: any[]; onClose: () => void; onSave: (a: any) => void }) {
  const [form, setForm] = useState({ name: admin?.name || "", email: admin?.email || "", password: "", shopId: admin?.shopId || shops[0]?.id, status: admin?.status || "active" });
  const selectedShop = shops.find(s => s.id === form.shopId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-gray-900 dark:text-white">{admin?.id ? "Modifier l'administrateur" : "Nouvel administrateur"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Nom complet</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">{admin?.id ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Boutique assignée</label>
            <select value={form.shopId} onChange={e => setForm(f => ({ ...f, shopId: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {shops.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Statut</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Annuler</button>
          <button onClick={() => onSave({ ...admin, ...form, shopName: shops.find((s: any) => s.id === form.shopId)?.name || "" })} className="px-4 py-2 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

export default function SAAdmins() {
  const [adminList, setAdminList] = useState<any[]>([]);
  const [shopsList, setShopsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalAdmin, setModalAdmin] = useState<any | null | "new">(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, shopsRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/shops')
      ]);
      setAdminList(usersRes.data);
      setShopsList(shopsRes.data);
    } catch (err) {
      console.error("Error fetching admins data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = adminList.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    (a.shop?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (a: any) => {
    try {
      const payload = { ...a };
      if (!payload.password || payload.password.trim() === "") {
        delete payload.password; // Do not send empty password
      }

      if (a.id) {
        await api.patch(`/auth/users/${a.id}`, payload);
      } else {
        await api.post('/auth/users', payload);
      }
      setModalAdmin(null);
      fetchData();
    } catch (error) {
      console.error("Error saving admin", error);
      alert("Erreur lors de l'enregistrement de l'administrateur");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await api.patch(`/auth/users/${id}/toggle-status`);
      fetchData();
    } catch (error) {
      console.error("Error toggling status", error);
      alert("Erreur lors du changement de statut");
    }
  };

  const deleteAdmin = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
      try {
        await api.delete(`/auth/users/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting admin", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Administrateurs</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{adminList.length} comptes administrateurs</p>
        </div>
        <button onClick={() => setModalAdmin("new")} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm transition-colors">
          <Plus size={16} />Nouvel admin
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* Cards grid on mobile, table on desktop */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50">
              {["Administrateur", "Boutique assignée", "Dernier login", "Statut", "Actions"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {filtered.map(admin => (
              <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{admin.name}</p>
                      <p className="text-xs text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                      {admin.shop?.logo && <img src={admin.shop.logo} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{admin.shop?.name || "Aucune"}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(admin.createdAt).toLocaleDateString("fr")}
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleStatus(admin.id)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${admin.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200"}`}>
                    <span style={{ display: admin.status === 'active' ? 'flex' : 'none', alignItems: 'center', gap: '0.375rem' }}><UserCheck size={11} />Actif</span>
                    <span style={{ display: admin.status !== 'active' ? 'flex' : 'none', alignItems: 'center', gap: '0.375rem' }}><UserX size={11} />Inactif</span>
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setModalAdmin(admin)} className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"><Edit2 size={15} /></button>
                    <button onClick={() => deleteAdmin(admin.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map(admin => (
          <div key={admin.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold">
                  {admin.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{admin.name}</p>
                  <p className="text-xs text-gray-500">{admin.email}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${admin.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {admin.status === "active" ? "Actif" : "Inactif"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-500">{admin.shop?.name || "Aucune"}</p>
              <div className="flex gap-2">
                <button onClick={() => setModalAdmin(admin)} className="p-1.5 text-gray-400 hover:text-amber-500 rounded-lg"><Edit2 size={14} /></button>
                <button onClick={() => deleteAdmin(admin.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalAdmin !== null && (
        <AdminModal
          admin={modalAdmin === "new" ? {} : modalAdmin}
          shops={shopsList}
          onClose={() => setModalAdmin(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
