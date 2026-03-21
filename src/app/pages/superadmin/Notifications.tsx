import { useState } from "react";
import { Bell, Key, AlertTriangle, Building2, Check, Trash2, CheckCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_CONFIG = {
  license: { icon: Key, bg: "bg-red-100 dark:bg-red-900/30", color: "text-red-600 dark:text-red-400", label: "Licence" },
  system: { icon: AlertTriangle, bg: "bg-amber-100 dark:bg-amber-900/30", color: "text-amber-600 dark:text-amber-400", label: "Système" },
  shop: { icon: Building2, bg: "bg-emerald-100 dark:bg-emerald-900/30", color: "text-emerald-600 dark:text-emerald-400", label: "Boutique" },
};

export default function SANotifications() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | Notification["type"]>("all");
  const { setNotificationCount } = useApp();

  const filtered = notifs.filter(n => filter === "all" || n.type === filter);
  const unreadCount = notifs.filter(n => !n.isRead).length;

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    setNotificationCount(0);
  };

  const deleteNotif = (id: string) => {
    const notif = notifs.find(n => n.id === id);
    setNotifs(prev => prev.filter(n => n.id !== id));
    if (notif && !notif.isRead) setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    return d.toLocaleDateString("fr", { day: "numeric", month: "short" });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{unreadCount} notification(s) non lue(s)</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">
            <CheckCheck size={15} />Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "license", "system", "shop"] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === type ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
          >
            {type === "all" ? "Toutes" : TYPE_CONFIG[type as keyof typeof TYPE_CONFIG].label}
            {type === "all" && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <Bell size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Aucune notification</p>
          </div>
        ) : filtered.map(notif => {
          const config = TYPE_CONFIG[notif.type as keyof typeof TYPE_CONFIG];
          const Icon = config.icon;
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${notif.isRead ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700" : "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                <Icon size={18} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-medium ${notif.isRead ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}>{notif.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                  </div>
                  {!notif.isRead && <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{formatTime(notif.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!notif.isRead && (
                  <button onClick={() => markRead(notif.id)} title="Marquer comme lu" className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                    <Check size={14} />
                  </button>
                )}
                <button onClick={() => deleteNotif(notif.id)} title="Supprimer" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}