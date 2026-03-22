import { useState, useEffect } from "react";
import { Search, Users, UserCheck, UserPlus, Trophy, Mail, Phone, Calendar, TrendingUp, MoreHorizontal } from "lucide-react";
import api from "../../api";

function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
          <Icon size={22} className={color} />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
          <p className="text-gray-900 dark:text-white text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function ShopClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Actif" | "Inactif">("all");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/reservations/customers");
        setClients(data);
      } catch (err) {
        console.error("Error fetching customers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filtered = clients.filter(c => {
    const matchSearch = (c.name || "").toLowerCase().includes(search.toLowerCase()) || 
                      (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
                      (c.phone || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === "Actif").length,
    newThisMonth: clients.filter(c => {
      const date = new Date(c.lastActivity);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length,
    mostActive: clients.length > 0 ? [...clients].sort((a, b) => b.reservationsCount - a.reservationsCount)[0]?.name : "—"
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-white">Clients</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Gérez votre base de données clients et suivez leur fidélité.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total clients" value={stats.total} bg="bg-violet-100 dark:bg-violet-900/30" color="text-violet-600 dark:text-violet-400" />
        <StatCard icon={UserCheck} label="Clients actifs" value={stats.active} bg="bg-emerald-100 dark:bg-emerald-900/30" color="text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={UserPlus} label="Nouveaux ce mois" value={stats.newThisMonth} bg="bg-blue-100 dark:bg-blue-900/30" color="text-blue-600 dark:text-blue-400" />
        <StatCard icon={Trophy} label="Client le plus actif" value={stats.mostActive} bg="bg-amber-100 dark:bg-amber-900/30" color="text-amber-600 dark:text-amber-400" />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou téléphone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full sm:w-auto">
          {(['all', 'Actif', 'Inactif'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === s 
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {s === 'all' ? 'Tous' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                {["Client", "Contact", "Résas", "Total généré", "Dernière activité", "Statut", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Chargement des clients...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Aucun client trouvé</td></tr>
              ) : filtered.map((client, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm">
                        {client.name?.charAt(0) || "?"}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <Phone size={12} /> {client.phone || "—"}
                      </div>
                      {client.email && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                          <Mail size={12} /> {client.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{client.reservationsCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp size={14} />
                      {client.totalGenerated?.toLocaleString("fr")} FCFA
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar size={12} />
                      {new Date(client.lastActivity).toLocaleDateString("fr")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      client.status === "Actif" 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
