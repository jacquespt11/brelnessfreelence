import { useState, useEffect } from "react";
import { Search, CheckCircle2, XCircle, Clock, ClipboardList, ChevronDown, MessageSquare } from "lucide-react";
import api from "../../api";
import { useApp } from "../../context/AppContext";

type ReservationStatus = "En attente" | "Confirmée" | "Complétée" | "Annulée";

const STATUS_FLOW: Record<ReservationStatus, ReservationStatus | null> = {
  "En attente": "Confirmée",
  "Confirmée": "Complétée",
  "Complétée": null,
  "Annulée": null,
};

const STATUS_STYLE: Record<ReservationStatus, string> = {
  "En attente": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Confirmée": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Complétée": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Annulée": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function DetailModal({ res, onClose, onUpdate }: { res: any; onClose: () => void; onUpdate: (id: string, status: string, notes?: string) => void }) {
  const [notes, setNotes] = useState(res.notes || "");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const nextStatus = STATUS_FLOW[res.status as ReservationStatus];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-gray-900 dark:text-white">Réservation #{res.id.split('-').pop()}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLE[res.status as ReservationStatus]}`}>{res.status}</span>
            <span className="text-xs text-gray-400">{new Date(res.createdAt).toLocaleString("fr")}</span>
          </div>

          {/* Customer info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Client</p>
            <div className="grid grid-cols-2 gap-2">
              <div><p className="text-xs text-gray-500 dark:text-gray-400">Nom</p><p className="text-sm font-medium text-gray-900 dark:text-white">{res.customerName}</p></div>
              <div><p className="text-xs text-gray-500 dark:text-gray-400">Téléphone</p><p className="text-sm font-medium text-gray-900 dark:text-white">{res.customerPhone}</p></div>
              {res.customerEmail && <div className="col-span-2"><p className="text-xs text-gray-500 dark:text-gray-400">Email</p><p className="text-sm text-gray-900 dark:text-white">{res.customerEmail}</p></div>}
            </div>
          </div>

          {/* Product info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Produit</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{res.product?.name || res.productName}</p>
              <span className="text-sm font-bold text-violet-600 dark:text-violet-400">× {res.quantity}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block flex items-center gap-1.5"><MessageSquare size={13} />Notes internes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Ajouter une note…" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>

          {/* Cancel */}
          {showCancel && (
            <div>
              <label className="text-sm text-red-600 mb-1 block">Raison d'annulation (requis)</label>
              <input value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Motif d'annulation…" className="w-full px-3 py-2 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-between">
          <div className="flex gap-2">
            {res.status !== "Annulée" && res.status !== "Complétée" && (
              <button
                onClick={() => { setShowCancel(s => !s); }}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
              >
                Annuler la réservation
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Fermer
            </button>
            {/* Always-rendered action buttons — visibility via `hidden` prevents React DOM reconciliation errors */}
            <button
              onClick={() => { if (cancelReason) { onUpdate(res.id, "Annulée", cancelReason); onClose(); } }}
              disabled={!cancelReason}
              className={`px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white transition-colors ${showCancel ? "" : "hidden"}`}
            >
              Confirmer l'annulation
            </button>
            <button
              onClick={() => { onUpdate(res.id, nextStatus!, notes); onClose(); }}
              className={`px-4 py-2 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 text-white transition-colors flex items-center gap-2 ${!showCancel && nextStatus ? "" : "hidden"}`}
            >
              <CheckCircle2 size={14} />
              {`Passer à "${nextStatus}"`}
            </button>
            <button
              onClick={() => { onUpdate(res.id, res.status, notes); onClose(); }}
              className={`px-4 py-2 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 text-white transition-colors ${!showCancel && !nextStatus ? "" : "hidden"}`}
            >
              Sauvegarder notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopReservations() {
  const { currentUser } = useApp();
  const [resList, setResList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | string>("all");
  const [selectedRes, setSelectedRes] = useState<any | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/reservations/me');
      // Format backend enum statuses (PENDING, CONFIRMED, COMPLETED, CANCELLED) to UI
      const formattedData = data.map((r: any) => {
        let frontendStatus = r.status;
        if (r.status === 'PENDING') frontendStatus = 'En attente';
        if (r.status === 'CONFIRMED') frontendStatus = 'Confirmée';
        if (r.status === 'COMPLETED') frontendStatus = 'Complétée';
        if (r.status === 'CANCELLED') frontendStatus = 'Annulée';
        return { ...r, status: frontendStatus };
      });
      setResList(formattedData);
    } catch (err) {
      console.error("Error fetching reservations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [currentUser]);

  const filtered = resList.filter(r => {
    const matchSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) || (r.product?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateRes = async (id: string, status: string, notes?: string) => {
    let backendStatus = status;
    if (status === 'En attente') backendStatus = 'PENDING';
    if (status === 'Confirmée') backendStatus = 'CONFIRMED';
    if (status === 'Complétée') backendStatus = 'COMPLETED';
    if (status === 'Annulée') backendStatus = 'CANCELLED';

    try {
      await api.patch(`/reservations/${id}/status`, {
        status: backendStatus,
      });
      fetchReservations();
    } catch (err) {
      console.error("Error updating reservation status", err);
      alert("Erreur lors de la mise à jour de la réservation.");
    }
  };

  const counts = {
    total: resList.length,
    pending: resList.filter(r => r.status === "En attente").length,
    confirmed: resList.filter(r => r.status === "Confirmée").length,
    completed: resList.filter(r => r.status === "Complétée").length,
    cancelled: resList.filter(r => r.status === "Annulée").length,
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-gray-900 dark:text-white">Réservations</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{resList.length} réservations au total</p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "En attente", count: counts.pending, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", icon: Clock },
          { label: "Confirmées", count: counts.confirmed, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", icon: ClipboardList },
          { label: "Complétées", count: counts.completed, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20", icon: CheckCircle2 },
          { label: "Annulées", count: counts.cancelled, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", icon: XCircle },
        ].map(({ label, count, color, bg, icon: Icon }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity`} onClick={() => setFilterStatus(label === 'Confirmées' ? 'Confirmée' : label)}>
            <Icon size={18} className={color} />
            <div>
              <p className={`text-xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client ou produit…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
          <option value="all">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Confirmée">Confirmée</option>
          <option value="Complétée">Complétée</option>
          <option value="Annulée">Annulée</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50">
                {["Client", "Produit", "Qté", "Date", "Statut", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">Aucune réservation trouvée</td></tr>
              ) : filtered.map(res => (
                <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer" onClick={() => setSelectedRes(res)}>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{res.customerName}</p>
                      <p className="text-xs text-gray-400">{res.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">{res.product?.name || res.productName}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900 dark:text-white">×{res.quantity}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(res.createdAt).toLocaleDateString("fr", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[res.status as ReservationStatus]}`}>{res.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedRes(res); }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 transition-colors"
                    >
                      <ChevronDown size={12} />Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRes && (
        <DetailModal
          res={selectedRes}
          onClose={() => setSelectedRes(null)}
          onUpdate={updateRes}
        />
      )}
    </div>
  );
}