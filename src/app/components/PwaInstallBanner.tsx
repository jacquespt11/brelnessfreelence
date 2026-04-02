import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

/**
 * Composant PWA Install Banner
 * Apparaît automatiquement quand le navigateur déclenche l'événement `beforeinstallprompt`
 * Compatible sur Android Chrome, Edge et certains navigateurs mobiles.
 */
export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show only if user hasn't dismissed before
      const dismissed = localStorage.getItem("brelness-pwa-dismissed");
      if (!dismissed) setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("brelness-pwa-dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-6 md:max-w-sm">
      <div className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-2xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-blue-600 flex items-center justify-center">
          <img src="/icon-192.png" alt="Brelness" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Installer Brelness</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Accès rapide depuis votre écran d'accueil</p>
        </div>
        <button
          onClick={handleInstall}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex-shrink-0"
        >
          <Download size={13} />
          Installer
        </button>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0 ml-1">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
