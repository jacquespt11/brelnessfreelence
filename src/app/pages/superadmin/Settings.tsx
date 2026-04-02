import { useState, useEffect, useRef } from "react";
import { User, Lock, Bell, Globe, Moon, Sun, Save, Camera } from "lucide-react";
import { useApp } from "../../context/AppContext";
import api from "../../api";

const LANGUAGES = ["Français", "English", "Español", "العربية"];
const TIMEZONES = ["Africa/Abidjan (UTC+0)", "Africa/Dakar (UTC+0)", "Africa/Lagos (UTC+1)", "Europe/Paris (UTC+1)"];

export default function SASettings() {
  const { currentUser, isDark, toggleDark, checkAuth } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"profile" | "security" | "notifications" | "system">("profile");
  
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatar: "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifSettings, setNotifSettings] = useState({ email: true, browser: true, reservations: true, licenses: true, system: true });
  const [systemSettings, setSystemSettings] = useState({ platformName: "Brelness", contactEmail: "admin@brelness.com", contactPhone: "", maintenanceMode: false });
  const [lang, setLang] = useState("Français");
  const [timezone, setTimezone] = useState("Africa/Abidjan (UTC+0)");

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      setProfile({ name: currentUser.name || "", email: currentUser.email || "", phone: currentUser.phone || "", avatar: currentUser.avatar || "" });
    }
    
    api.get('/settings').then(res => {
      if (res.data) {
        setSystemSettings({
          platformName: res.data.platformName || "Brelness",
          contactEmail: res.data.contactEmail || "admin@brelness.com",
          contactPhone: res.data.contactPhone || "",
          maintenanceMode: res.data.maintenanceMode || false
        });
      }
    }).catch(console.error);
  }, [currentUser]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const upRes = await api.post('/upload', { filename: file.name, data: base64 });
        setProfile(p => ({ ...p, avatar: upRes.data.url }));
      } catch (err) {
        setError("Erreur lors de l'upload de l'image.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setError("");
      if (tab === "profile") {
        await api.patch(`/auth/users/${currentUser?.id}`, { name: profile.name, email: profile.email, phone: profile.phone, avatar: profile.avatar });
        await checkAuth();
      } else if (tab === "security") {
        if (passwords.new !== passwords.confirm) {
          setError("Les mots de passe ne correspondent pas.");
          return;
        }
        if (passwords.new.length > 0) {
          await api.patch(`/auth/users/${currentUser?.id}`, { password: passwords.new });
          setPasswords({ current: "", new: "", confirm: "" });
        }
      } else if (tab === "system") {
        await api.patch('/settings', systemSettings);
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError("Erreur lors de l'enregistrement.");
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Sécurité", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "Système", icon: Globe },
  ] as const;

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Gérez votre compte et vos préférences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-52 flex-shrink-0">
          <nav className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          {tab === "profile" && (
            <div className="space-y-5">
              <h3 className="text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Informations du profil</h3>
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover" />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                      {profile.name.charAt(0).toUpperCase() || "S"}
                    </div>
                  )}
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-md">
                    <Camera size={13} />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{profile.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Super Administrateur</p>
                  <button onClick={() => fileInputRef.current?.click()} className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">Changer la photo</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Nom complet</label>
                  <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
                  <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Téléphone</label>
                  <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-5">
              <h3 className="text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Sécurité du compte</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Mot de passe actuel</label>
                  <input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Nouveau mot de passe</label>
                  <input type="password" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Confirmer le nouveau mot de passe</label>
                  <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">Authentification à deux facteurs (2FA)</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Renforcez la sécurité de votre compte avec le 2FA.</p>
                <button className="mt-2 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs hover:bg-amber-700 transition-colors">Activer le 2FA</button>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-5">
              <h3 className="text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Préférences de notifications</h3>
              <div className="space-y-3">
                {[
                  { key: "email", label: "Notifications par email", desc: "Recevoir des alertes par email" },
                  { key: "browser", label: "Notifications navigateur", desc: "Notifications push dans le navigateur" },
                  { key: "reservations", label: "Nouvelles réservations", desc: "Alertes à chaque nouvelle réservation" },
                  { key: "licenses", label: "Licences & expiration", desc: "Rappels avant expiration des licences" },
                  { key: "system", label: "Alertes système", desc: "Mises à jour et anomalies système" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifSettings[key as keyof typeof notifSettings] ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifSettings[key as keyof typeof notifSettings] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "system" && (
            <div className="space-y-5">
              <h3 className="text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Paramètres système</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Nom de la Plateforme</label>
                    <input value={systemSettings.platformName} onChange={e => setSystemSettings(s => ({ ...s, platformName: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Email de contact central</label>
                    <input type="email" value={systemSettings.contactEmail} onChange={e => setSystemSettings(s => ({ ...s, contactEmail: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Thème de l'interface</label>
                  <div className="flex gap-3">
                    <button onClick={() => isDark && toggleDark()} className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${!isDark ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}>
                      <Sun size={18} className={!isDark ? "text-blue-600" : "text-gray-400"} />
                      <span className={`text-sm font-medium ${!isDark ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400"}`}>Mode clair</span>
                    </button>
                    <button onClick={() => !isDark && toggleDark()} className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${isDark ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}>
                      <Moon size={18} className={isDark ? "text-blue-400" : "text-gray-400"} />
                      <span className={`text-sm font-medium ${isDark ? "text-blue-300" : "text-gray-600 dark:text-gray-400"}`}>Mode sombre</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Langue</label>
                  <select value={lang} onChange={e => setLang(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Fuseau horaire</label>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {TIMEZONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              {saved && <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><Save size={14} />Modifications enregistrées !</p>}
            </div>
            <div className="ml-auto">
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
                <Save size={15} />Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
