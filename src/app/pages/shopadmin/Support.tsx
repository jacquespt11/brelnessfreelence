import { useEffect, useState } from "react";
import api from "../../api";
import { LifeBuoy, Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ShopSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ type: 'TECHNICAL', subject: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets/me');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/tickets', form);
      toast.success('Ticket envoyé avec succès');
      setIsModalOpen(false);
      setForm({ type: 'TECHNICAL', subject: '', description: '' });
      fetchTickets();
    } catch {
      toast.error('Erreur lors de l\'envoi du ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const statusMap = {
    PENDING: { label: 'En attente', color: 'bg-amber-100 text-amber-800', icon: Clock },
    IN_PROGRESS: { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
    RESOLVED: { label: 'Résolu', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  };

  const typeMap = {
    TECHNICAL: 'Technique',
    RENEWAL: 'Renouvellement',
    OTHER: 'Autre',
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assistance & Support</h1>
          <p className="text-gray-500 dark:text-gray-400">Historique de vos requêtes et communication avec l'administration.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Nouveau Ticket
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Chargement...</div>
        ) : tickets.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <LifeBuoy size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Aucun ticket n'a été créé pour le moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {tickets.map(ticket => {
              const StatusIcon = statusMap[ticket.status as keyof typeof statusMap].icon;
              return (
                <div key={ticket.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${ticket.type === 'RENEWAL' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {typeMap[ticket.type as keyof typeof typeMap]}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{ticket.subject}</h3>
                    </div>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusMap[ticket.status as keyof typeof statusMap].color}`}>
                      <StatusIcon size={14} />
                      {statusMap[ticket.status as keyof typeof statusMap].label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">{ticket.description}</p>
                  <p className="text-xs text-gray-400 mt-3">{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Créer un ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                <select
                  required
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="TECHNICAL">Problème Technique</option>
                  <option value="RENEWAL">Demande de Renouvellement / Offre</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sujet</label>
                <input
                  required
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Bref résumé de votre demande"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                  placeholder="Détaillez votre demande ici..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
