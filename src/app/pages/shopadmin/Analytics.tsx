import { useState, useEffect } from "react";
import { TrendingUp, Download, Calendar } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useApp } from "../../context/AppContext";
import api from "../../api";
import { productReservationTrend, reservationTrend } from "../../data/mockData";


export default function ShopAnalytics() {
  // Trigger Vite recompilation
  const { currentUser } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/shops/me/analytics?period=${period}`);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  const topProductsData = analytics?.topProducts?.map((p: any) => ({
    name: p.name.slice(0, 14) + (p.name.length > 14 ? "…" : ""),
    reservations: p.reservationCount,
  })) || [];

  const trendData = analytics?.trends?.map((t: any) => ({
    day: new Date(t.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
    reservations: t.count,
    revenu: t.revenue,
  })) || [];

  const pieData = analytics?.salesByCategory || [
    { name: "Vide", value: 1, color: "#e5e7eb" }
  ];

  const handleExport = () => {
    if (!analytics) return;
    const rows = [
      ["Date", "Nombre de réservations"],
      ...analytics.trends.map((t: any) => [t.date, t.count])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `brelness_analytics_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Performance de votre boutique</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
            {(["week", "month", "year"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${period === p ? "bg-blue-600 text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}>
                {p === "week" ? "Semaine" : p === "month" ? "Mois" : "Année"}
              </button>
            ))}
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download size={15} />Exporter
          </button>
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Vues totales", value: analytics?.totalViews?.toLocaleString("fr") || "0", change: "-", positive: true },
          { label: "Réservations totales", value: analytics?.totalReservations?.toString() || "0", change: "-", positive: true },
          { label: "Revenus (Complétés)", value: `${analytics?.revenue?.toLocaleString("fr") || 0} F`, change: "-", positive: true },
          { label: "Taux d'achèvement", value: `${analytics?.completionRate || 0}%`, change: "-", positive: true },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.label}</p>
            <p className="text-gray-900 dark:text-white mt-1" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>{kpi.value}</p>
            <span className={`text-xs mt-1 inline-block ${kpi.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
              <TrendingUp size={11} className="inline mr-0.5" />{kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenus vs Réservations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white mb-1">Revenus vs Réservations</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Tendances du Revenu de Réservations Complétées</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e0e7ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#e0e7ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-700" />
              <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "0.75rem", color: "#f9fafb" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area yAxisId="left" type="monotone" dataKey="revenu" stroke="#a5b4fc" fill="url(#viewGrad)" name="Revenus (F)" />
              <Area yAxisId="right" type="monotone" dataKey="reservations" stroke="#7c3aed" fill="url(#resGrad2)" name="Volume" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white mb-1">Ventes par Type</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Répartition des ventes (Produits vs Services)</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {pieData.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "0.75rem", color: "#f9fafb" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {pieData.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900 dark:text-white w-6 text-right">
                      {analytics?.revenue ? Math.round((item.value / (pieData.reduce((a:any, b:any)=>a+b.value, 0))) * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white mb-1">Produits les plus réservés</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Par nombre de réservations</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProductsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-gray-100 dark:stroke-gray-700" />
              <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "0.75rem", color: "#f9fafb" }} />
              <Bar dataKey="reservations" fill="#7c3aed" radius={[0, 6, 6, 0]} name="Réservations" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white mb-1">Tendance hebdomadaire</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Réservations par jour cette semaine</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-700" />
              <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "0.75rem", color: "#f9fafb" }} />
              <Line type="monotone" dataKey="reservations" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} name="Réservations" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-gray-900 dark:text-white mb-4">Exporter les données</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Liste des réservations", format: "PDF" },
            { label: "Rapport de vente", format: "Excel" },
            { label: "Données clients", format: "CSV" },
            { label: "Analytics complet", format: "PDF" },
          ].map(item => (
            <button key={item.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Download size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400">{item.format}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
