import { useState, useEffect } from "react";
import { Building2, Users, Key, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import api from "../../api";

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
          <p className="text-gray-900 dark:text-white mt-1" style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1 }}>{value}</p>
          {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function SADashboard() {
  const [shops, setShops] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Still using mock notifications structure but empty for now since no backend notifications table exists
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [shopsRes, usersRes, notifsRes] = await Promise.all([
          api.get('/shops'),
          api.get('/auth/users'),
          api.get('/notifications')
        ]);
        setShops(shopsRes.data);
        setAdmins(usersRes.data.filter((u: any) => u.role === 'SHOP_ADMIN'));
        setNotifications(notifsRes.data);
      } catch (err) {
        console.error("Error fetching admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeShops = shops.filter(s => s.status === "active").length;
  const expiredLicenses = shops.filter(s => s.license?.status === "Expiré").length;
  const expiringLicenses = shops.filter(s => {
    if (!s.license || !s.license.endDate) return false;
    const days = (new Date(s.license.endDate).getTime() - Date.now()) / 86400000;
    return s.license.status === "Actif" && days < 30 && days > 0;
  });

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 dark:text-white">Tableau de bord</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Vue d'ensemble de la plateforme Brelness</p>
      </div>

      {/* Alerts */}
      {(expiredLicenses > 0 || expiringLicenses.length > 0) && (
        <div className="space-y-2">
          {expiredLicenses > 0 && (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <XCircle size={18} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">
                <strong>{expiredLicenses}</strong> boutique(s) avec une licence expirée — action requise.
              </p>
            </div>
          )}
          {expiringLicenses.map(s => (
            <div key={s.id} className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
              <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                La licence de <strong>{s.name}</strong> expire le {s.license?.endDate ? new Date(s.license.endDate).toLocaleDateString("fr") : "bientôt"}.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Building2} label="Boutiques actives" value={activeShops} sub={`${shops.length - activeShops} inactive(s)`} color="bg-blue-500" />
        <StatCard icon={Key} label="Licences actives" value={shops.filter(s => s.license?.status === "Actif").length} sub={`${expiredLicenses} expirée(s)`} color="bg-emerald-500" />
        <StatCard icon={Users} label="Administrateurs" value={admins.length} sub={`${admins.length} actifs`} color="bg-amber-500" />
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-gray-900 dark:text-white mb-4">Activités récentes</h3>
        <div className="space-y-3">
          {notifications.filter(n => n.type !== "reservation").slice(0, 5).map(notif => (
            <div key={notif.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.type === "license" ? "bg-red-100 dark:bg-red-900/30" : notif.type === "shop" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-gray-100 dark:bg-gray-700"}`}>
                {notif.type === "license" && <Key size={14} className="text-red-600 dark:text-red-400" />}
                {notif.type === "system" && <AlertTriangle size={14} className="text-gray-600 dark:text-gray-400" />}
                {notif.type === "shop" && <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white font-medium">{notif.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{notif.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {new Date(notif.createdAt).toLocaleDateString("fr", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {!notif.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      </div>

      {/* Shops quick overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-gray-900 dark:text-white">Boutiques récentes</h3>
          <a href="/superadmin/shops" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Voir tout</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                {["Boutique", "Catégorie", "Licence", "Statut"].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {shops.map(shop => (
                <tr key={shop.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{shop.name}</p>
                        <p className="text-xs text-gray-400">{shop.users?.length > 0 ? shop.users[0].name : "Sans administrateur"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 capitalize">{shop.category}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${shop.license?.status === "Actif" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : shop.license?.status === "Expiré" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>
                      {shop.license?.status === "Actif" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {shop.license?.type || "Basic"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${shop.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
                      {shop.status === "active" ? "Active" : "Inactive"}
                    </span>
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
