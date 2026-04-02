import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { CreditCard, AlertTriangle, CheckCircle2, Package, Calendar } from "lucide-react";
import api from "../../api";
import { Link } from "react-router";

export default function ShopSubscription() {
  const { currentUser } = useApp();
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.shopId) {
      api.get(`/shops/me/shop`)
        .then(res => {
          setShop(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [currentUser]);

  if (loading) return <div className="p-6">Chargement...</div>;

  const license = shop?.license;
  
  if (!license) return <div className="p-6">Aucun abonnement trouvé.</div>;

  // Constants
  const isExpired = license.status === 'EXPIRED' || license.status === 'GRACE_PERIOD';
  const isWarning = license.status === 'WARNING';
  
  const statusColors = {
    ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    WARNING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    GRACE_PERIOD: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    EXPIRED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusLabels = {
    ACTIVE: "Actif",
    WARNING: "Bientôt expiré",
    GRACE_PERIOD: "Période de Grâce (Lecture seule)",
    EXPIRED: "Expiré (Lecture seule)",
  };

  const endDate = new Date(license.endDate);
  const totalDays = Math.ceil((endDate.getTime() - new Date(license.startDate).getTime()) / (1000 * 3600 * 24));
  const remainingDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  
  const progressPercent = remainingDays > 0 ? Math.max(0, Math.min(100, (remainingDays / totalDays) * 100)) : 0;

  const quotaProducts = license.type === 'Pro' ? 'Illimité' : '50';
  const quotaReservations = license.type === 'Pro' ? 'Illimité' : '100 / mois';

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon Abonnement</h1>
        <p className="text-gray-500 dark:text-gray-400">Gérez votre formule et vos plafonds d'utilisation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Card status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Forfait actuel</p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  {license.type}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[license.status as keyof typeof statusColors]}`}>
                    {statusLabels[license.status as keyof typeof statusLabels]}
                  </span>
                </h2>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <CreditCard size={24} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Jours restants: {remainingDays > 0 ? remainingDays : 0}</span>
                <span className="font-medium text-gray-900 dark:text-white">{endDate.toLocaleDateString()}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isExpired ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {isExpired && (
                <p className="text-sm text-red-600 font-medium flex items-center gap-2 mt-2">
                  <AlertTriangle size={16} />
                  Votre boutique est en mode lecture seule.
                </p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-4">
              <Link to="/admin/support" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-center text-sm font-medium transition-colors">
                Demander un renouvellement
              </Link>
            </div>
          </div>

          {/* Quotas */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quotas & Limites</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
                  <Package size={18} />
                  <span className="text-sm font-medium">Produits / Services</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{shop._count?.products || 0} / {quotaProducts}</p>
              </div>

              <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
                  <Calendar size={18} />
                  <span className="text-sm font-medium">Réservations</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{shop._count?.reservations || 0} / {quotaReservations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits panel */}
        <div className="col-span-1">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-sm text-white h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            <h3 className="text-lg font-bold mb-6">Avantages de votre forfait {license.type}</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-blue-100 text-sm">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={20} />
                <span>Panneau d'administration Brelness dédié</span>
              </li>
              <li className="flex gap-3 text-blue-100 text-sm">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={20} />
                <span>Boutique publique personnalisable</span>
              </li>
              <li className="flex gap-3 text-blue-100 text-sm">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={20} />
                <span>Prise de rendez-vous en ligne</span>
              </li>
              <li className="flex gap-3 text-blue-100 text-sm">
                <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={20} />
                <span>Support client Brelness prioritaire</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-blue-200 text-center">
                Pour passer à un forfait supérieur (Pro), veuillez contacter le support via un ticket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
