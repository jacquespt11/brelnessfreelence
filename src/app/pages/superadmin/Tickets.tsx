import { useEffect, useState } from "react";
import api from "../../api";
import { LifeBuoy, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function SATickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets/admin/all');
      setTickets(res.data);
    } catch {
      toast.error('Erreur de chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/tickets/admin/${id}/status`, { status: newStatus });
      toast.success('Statut mis à jour');
      fetchTickets();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const statusMap = {
    PENDING: { label: 'En attente', class: 'bg-amber-100 text-amber-800' },
    IN_PROGRESS: { label: 'En cours', class: 'bg-blue-100 text-blue-800' },
    RESOLVED: { label: 'Résolu', class: 'bg-emerald-100 text-emerald-800' },
  };

  const typeMap = {
    TECHNICAL: 'Technique',
    RENEWAL: 'Renouvellement',
    OTHER: 'Autre',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tickets Support</h1>
          <p className="text-gray-500 dark:text-gray-400">Gérez les demandes d'assistance des boutiques.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Chargement...</div>
        ) : tickets.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <LifeBuoy size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500">Aucun ticket reçu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Boutique</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Demande</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Date</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Statut</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {tickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 align-top">
                      <p className="font-medium text-gray-900 dark:text-white">{ticket.shop?.name}</p>
                      <p className="text-xs text-gray-500">{ticket.shop?.email}</p>
                    </td>
                    <td className="p-4 align-top max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                          {typeMap[ticket.type as keyof typeof typeMap]}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{ticket.subject}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{ticket.description}</p>
                    </td>
                    <td className="p-4 align-top text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-top">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusMap[ticket.status as keyof typeof statusMap].class}`}>
                        {statusMap[ticket.status as keyof typeof statusMap].label}
                      </span>
                    </td>
                    <td className="p-4 align-top text-right">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket.id, e.target.value)}
                        className="text-sm px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="PENDING">En attente</option>
                        <option value="IN_PROGRESS">En cours</option>
                        <option value="RESOLVED">Résolu</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
