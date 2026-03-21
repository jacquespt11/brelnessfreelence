import { useState, useEffect } from "react";
import { Key, CheckCircle, XCircle, Clock, RefreshCw, AlertTriangle } from "lucide-react";
import api from "../../api";

export type LicenseType = "Basic" | "Professional" | "Enterprise";
export type LicenseStatus = "Actif" | "Expiré" | "Annulé";

const LICENSE_TYPES: LicenseType[] = ["Basic", "Professional", "Enterprise"];
const LICENSE_FEATURES: Record<LicenseType, string[]> = {
  Basic: ["5 produits max", "50 réservations/mois", "Support email"],
  Professional: ["100 produits max", "500 réservations/mois", "Analytics", "Support prioritaire"],
  Enterprise: ["Produits illimités", "Réservations illimitées", "Analytics avancées", "Support 24/7", "API access"],
};

function RenewModal({ shopId, currentType, onClose, onRenew }: any) {
  const [licenseType, setLicenseType] = useState<LicenseType>(currentType);
  const [duration, setDuration] = useState<30 | 90 | 365>(365);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-gray-900 dark:text-white">Renouveler la licence</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Type de licence</label>
            <div className="grid grid-cols-3 gap-3">
              {LICENSE_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setLicenseType(type)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${licenseType === type ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-gray-600 hover:border-indigo-300"}`}
                >
                  <p className={`text-sm font-medium ${licenseType === type ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}`}>{type}</p>
                  <ul className="mt-1 space-y-0.5">
                    {LICENSE_FEATURES[type].slice(0, 2).map(f => (
                      <li key={f} className="text-xs text-gray-500 dark:text-gray-400">• {f}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Durée</label>
            <div className="flex gap-3">
              {([30, 90, 365] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${duration === d ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-indigo-300"}`}
                >
                  {d === 365 ? "1 an" : `${d} jours`}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
            <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              Nouvelle expiration : {new Date(Date.now() + duration * 86400000).toLocaleDateString("fr", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Annuler</button>
          <button onClick={() => onRenew(shopId, licenseType, duration)} className="px-4 py-2 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-2">
            <RefreshCw size={14} />Renouveler
          </button>
        </div>
      </div>
    </div>
  );
}

function getDaysUntilExpiry(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export default function SALicenses() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewModal, setRenewModal] = useState<{ shopId: string; currentType: LicenseType } | null>(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/shops');
      const withLicenses = data.map((s: any) => ({
        ...s,
        license: s.license || { type: "Basic", status: "Actif", startDate: s.createdAt, endDate: new Date(Date.now() + 365*86400000).toISOString() }
      }));
      setShops(withLicenses);
    } catch (err) {
      console.error("Error fetching shops for licenses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleRenew = async (shopId: string, type: LicenseType, days: number) => {
    try {
      await api.post(`/shops/${shopId}/license/renew`, { type, days });
      await fetchShops();
      setRenewModal(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du renouvellement de la licence.");
    }
  };

  const handleCancel = async (shopId: string) => {
    if (confirm("Annuler la licence de cette boutique ?")) {
      try {
        await api.post(`/shops/${shopId}/license/cancel`);
        await fetchShops();
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'annulation de la licence.");
      }
    }
  };

  const statusIcon = (status: LicenseStatus) => {
    if (status === "Actif") return <CheckCircle size={14} className="text-emerald-500" />;
    if (status === "Expiré") return <XCircle size={14} className="text-red-500" />;
    return <XCircle size={14} className="text-gray-400" />;
  };

  const statusColor = (status: LicenseStatus) => {
    if (status === "Actif") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (status === "Expiré") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400";
  };

  const typeColor = (type: LicenseType) => {
    if (type === "Enterprise") return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    if (type === "Professional") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-gray-900 dark:text-white">Licences</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Gestion des licences par boutique</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Actives", value: shops.filter(s => s.license.status === "Actif").length, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Expirées", value: shops.filter(s => s.license.status === "Expiré").length, icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
          { label: "Annulées", value: shops.filter(s => s.license.status === "Annulé").length, icon: Clock, color: "text-gray-400", bg: "bg-gray-100 dark:bg-gray-700" },
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
              <item.icon size={20} className={item.color} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{item.label}</p>
              <p className="text-gray-900 dark:text-white font-bold text-xl">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* License table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                {["Boutique", "Type", "Statut", "Début", "Expiration", "Jours restants", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {shops.map(shop => {
                const days = getDaysUntilExpiry(shop.license.endDate);
                const isExpiring = shop.license.status === "Actif" && days > 0 && days <= 30;
                return (
                  <tr key={shop.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${isExpiring ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}`}>
                    <td className="px-5 py-3.5">
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
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor(shop.license.type)}`}>{shop.license.type}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(shop.license.status)}`}>
                        {statusIcon(shop.license.status)}
                        {shop.license.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(shop.license.startDate).toLocaleDateString("fr")}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(shop.license.endDate).toLocaleDateString("fr")}
                    </td>
                    <td className="px-5 py-3.5">
                      {shop.license.status === "Actif" ? (
                        <div className="flex items-center gap-1.5">
                          {isExpiring && <AlertTriangle size={13} className="text-amber-500" />}
                          <span className={`text-sm font-medium ${days <= 0 ? "text-red-500" : isExpiring ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                            {days <= 0 ? "Expiré" : `${days}j`}
                          </span>
                        </div>
                      ) : <span className="text-sm text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {shop.license.status !== "Annulé" && (
                          <button
                            onClick={() => setRenewModal({ shopId: shop.id, currentType: shop.license.type })}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                          >
                            <RefreshCw size={11} />Renouveler
                          </button>
                        )}
                        {shop.license.status === "Actif" && (
                          <button
                            onClick={() => handleCancel(shop.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 transition-colors"
                          >
                            <XCircle size={11} />Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <h3 className="text-gray-900 dark:text-white mb-4">Comparatif des licences</h3>
        <div className="grid grid-cols-3 gap-4">
          {LICENSE_TYPES.map(type => (
            <div key={type} className={`p-4 rounded-xl border-2 ${type === "Enterprise" ? "border-purple-400 dark:border-purple-600" : type === "Professional" ? "border-blue-300 dark:border-blue-700" : "border-gray-200 dark:border-gray-700"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Key size={16} className={type === "Enterprise" ? "text-purple-500" : type === "Professional" ? "text-blue-500" : "text-gray-400"} />
                <span className={`font-semibold text-sm ${type === "Enterprise" ? "text-purple-600 dark:text-purple-400" : type === "Professional" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>{type}</span>
              </div>
              <ul className="space-y-1.5">
                {LICENSE_FEATURES[type].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {renewModal && (
        <RenewModal
          shopId={renewModal.shopId}
          currentType={renewModal.currentType}
          onClose={() => setRenewModal(null)}
          onRenew={handleRenew}
        />
      )}
    </div>
  );
}
