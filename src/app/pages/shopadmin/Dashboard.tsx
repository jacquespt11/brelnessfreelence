import { useState, useEffect } from "react";
import { Package, ClipboardList, TrendingUp, AlertTriangle, Star, Clock, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../../context/AppContext";
import api from "../../api";

function StatCard({ icon: Icon, label, value, sub, color, bg }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
          <p className="text-gray-900 dark:text-white mt-1" style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1 }}>{value}</p>
          {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
          <Icon size={20} className={color} />
        </div>
      </div>
    </div>
  );
}

export default function ShopDashboard() {
  const { currentUser } = useApp();
  
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [shopReservations, setShopReservations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.shopId) return;
      try {
        setLoading(true);
        const [prodRes, resRes, notifsRes] = await Promise.all([
          api.get(`/products/shop/${currentUser.shopId}`),
          api.get('/reservations/me'),
          api.get('/notifications')
        ]);
        setShopProducts(prodRes.data);
        setNotifications(notifsRes.data);
        
        // Format backend enum statuses to UI
        const formattedData = resRes.data.map((r: any) => {
          let frontendStatus = r.status;
          if (r.status === 'PENDING') frontendStatus = 'En attente';
          if (r.status === 'CONFIRMED') frontendStatus = 'Confirmée';
          if (r.status === 'COMPLETED') frontendStatus = 'Complétée';
          if (r.status === 'CANCELLED') frontendStatus = 'Annulée';
          return { ...r, status: frontendStatus };
        });
        setShopReservations(formattedData);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const pendingRes = shopReservations.filter(r => r.status === "En attente");
  const lowStockProducts = shopProducts.filter(p => p.stock <= 5);

  const topProducts = [...shopProducts].sort((a, b) => (b.reservationCount || 0) - (a.reservationCount || 0));

  // Temporary mock data for trend chart since we don't have historical data on the backend yet
  const productReservationTrend = [
    { day: "Lun", reservations: 4 },
    { day: "Mar", reservations: 7 },
    { day: "Mer", reservations: 5 },
    { day: "Jeu", reservations: 11 },
    { day: "Ven", reservations: 9 },
    { day: "Sam", reservations: 15 },
    { day: "Dim", reservations: 12 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Tableau de bord</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Bienvenue, {currentUser?.name} — {currentUser?.shopName || "Votre Boutique"}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
          <span className="text-sm text-violet-700 dark:text-violet-400 font-medium">En ligne</span>
        </div>
      </div>

      {/* Alerts */}
      {(pendingRes.length > 0 || lowStockProducts.length > 0) && (
        <div className="space-y-2">
          {pendingRes.length > 0 && (
            <div className="flex items-center gap-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl px-4 py-3">
              <Clock size={16} className="text-violet-500 flex-shrink-0" />
              <p className="text-sm text-violet-700 dark:text-violet-400">
                <strong>{pendingRes.length}</strong> réservation(s) en attente de confirmation.
              </p>
              <a href="/admin/reservations" className="ml-auto text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">Voir tout</a>
            </div>
          )}
          {lowStockProducts.map(p => (
            <div key={p.id} className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>{p.name}</strong> — Stock faible : {p.stock} unité(s).
              </p>
            </div>
          ))}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total produits" value={shopProducts.length} sub={`${shopProducts.filter(p => p.status === "active").length} actifs`} bg="bg-violet-100 dark:bg-violet-900/30" color="text-violet-600 dark:text-violet-400" />
        <StatCard icon={ClipboardList} label="Réservations" value={shopReservations.length} sub={`${pendingRes.length} en attente`} bg="bg-indigo-100 dark:bg-indigo-900/30" color="text-indigo-600 dark:text-indigo-400" />
        <StatCard icon={Star} label="Note moyenne" value={shopProducts.length > 0 ? (shopProducts.reduce((s, p) => s + p.rating, 0) / shopProducts.length).toFixed(1) : "—"} sub={`${shopProducts.reduce((s, p) => s + p.reviewCount, 0)} avis`} bg="bg-amber-100 dark:bg-amber-900/30" color="text-amber-600 dark:text-amber-400" />
        <StatCard icon={TrendingUp} label="Taux confirmation" value={shopReservations.length > 0 ? `${Math.round((shopReservations.filter(r => r.status === "Complétée").length / shopReservations.length) * 100)}%` : "—"} sub="des réservations" bg="bg-emerald-100 dark:bg-emerald-900/30" color="text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white mb-1">Réservations cette semaine</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Par jour</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={productReservationTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-700" />
              <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "0.75rem", color: "#f9fafb" }} />
              <Line type="monotone" dataKey="reservations" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} name="Réservations" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white mb-1">Produits les plus réservés</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Top produits</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts.map(p => ({ name: p.name.slice(0, 12) + (p.name.length > 12 ? "…" : ""), reservations: p.reservationCount }))}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-700" />
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "0.75rem", color: "#f9fafb" }} />
              <Bar dataKey="reservations" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Réservations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent reservations + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent reservations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white">Réservations récentes</h3>
            <a href="/admin/reservations" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">Voir tout</a>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {shopReservations.slice(0, 4).map(res => (
              <div key={res.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{res.customerName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{res.product?.name || res.productName} × {res.quantity}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${res.status === "En attente" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : res.status === "Confirmée" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : res.status === "Complétée" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {res.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white">Mes produits</h3>
            <a href="/admin/products" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">Gérer</a>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {shopProducts.slice(0, 4).map(prod => (
              <div key={prod.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{prod.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{prod.price?.toLocaleString("fr")} FCFA · Stock: {prod.stock}</p>
                </div>
                <div className="flex items-center gap-1">
                  {prod.stock <= 5 && <AlertTriangle size={12} className="text-amber-500" />}
                  <span className={`w-2 h-2 rounded-full ${prod.status === "active" ? "bg-green-400" : "bg-gray-300"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications / Activités Récentes */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 dark:text-white">Dernières notifications</h3>
          <a href="/admin/notifications" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">Voir tout</a>
        </div>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">Aucune notification à afficher.</p>
          ) : notifications.slice(0, 5).map(notif => (
            <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-xl border ${notif.isRead ? 'border-transparent' : 'border-violet-100 dark:border-violet-900/40 bg-violet-50/50 dark:bg-violet-900/10'}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-violet-100 dark:bg-violet-900/30">
                {notif.type === "reservation" ? <ClipboardList size={14} className="text-violet-600 dark:text-violet-400" /> : <AlertTriangle size={14} className="text-gray-600 dark:text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${notif.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-medium'}`}>{notif.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{notif.message}</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 whitespace-nowrap whitespace-nowrap">
                {new Date(notif.createdAt).toLocaleDateString("fr", { day: 'numeric', month: 'short' })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
