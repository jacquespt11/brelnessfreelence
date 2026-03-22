import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ShoppingBag, BarChart3, Users, Zap, CalendarCheck, ShieldCheck } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Auto slide for the carousel
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const finishWelcome = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Section 1: Logo et Titre */}
      <header className="pt-8 pb-4 px-6 md:px-12 max-w-7xl mx-auto w-full flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
          <ShoppingBag size={20} className="text-white" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Brelness</h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col">
        
        {/* Section 2: Carousel & Dark Background */}
        <section className="mt-[15px] relative rounded-[32px] overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="relative h-[350px] md:h-[400px] w-full flex items-center">
            
            {/* Slide 1 */}
            <div className={`absolute inset-0 px-8 md:px-16 flex flex-col justify-center transition-opacity duration-700 ease-in-out ${currentSlide === 0 ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <div className="max-w-2xl text-left">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-100/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm font-bold tracking-wide mb-4 border border-blue-200 dark:border-blue-500/20">
                  Bienvenue à bord
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                  Prêt à booster votre business ?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  Découvrez une nouvelle manière de gérer vos ventes, vos clients et vos réservations. Brelness a été conçu pour simplifier votre quotidien et accélérer votre croissance.
                </p>
              </div>
            </div>

            {/* Slide 2 */}
            <div className={`absolute inset-0 px-8 md:px-16 flex flex-col justify-center transition-opacity duration-700 ease-in-out ${currentSlide === 1 ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <div className="max-w-2xl text-left">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-100/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm font-bold tracking-wide mb-4 border border-blue-200 dark:border-blue-500/20">
                  Comment ça marche
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                  La puissance de <span className="text-blue-600">Brelness</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  Créez votre boutique en quelques clics, personnalisez votre catalogue, et commencez à accepter des réservations instantanément. Suivez vos revenus en temps réel et fidélisez vos clients avec nos outils intégrés.
                </p>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-8 left-8 md:left-16 flex gap-2 z-20">
              <button onClick={() => setCurrentSlide(0)} className={`w-10 h-1.5 rounded-full transition-all ${currentSlide === 0 ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`} />
              <button onClick={() => setCurrentSlide(1)} className={`w-10 h-1.5 rounded-full transition-all ${currentSlide === 1 ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`} />
            </div>
          </div>
        </section>

        {/* Section 3: Features & Call to Action */}
        <section className="mt-16 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Boutique en ligne</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Un catalogue digital sublime pour présenter vos produits et services au monde entier.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CalendarCheck size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Réservations 24/7</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Acceptez vos commandes et prises de rendez-vous jour et nuit, sans effort.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fidélisation ciblée</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Suivez précisément vos clients, leurs habitudes et récompensez les plus fidèles.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Statistiques clés</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Visualisez d'un coup d'œil vos revenus, vos visites et votre croissance mensuelle.</p>
            </div>

          </div>

          <div className="flex flex-col items-center justify-center text-center mt-8">
            <button 
              onClick={finishWelcome}
              className="group flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-black hover:shadow-2xl hover:shadow-gray-900/20 dark:hover:bg-gray-100 transition-all active:scale-95"
            >
              Commencer maintenant
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 mt-4 flex items-center gap-1.5"><ShieldCheck size={16} /> Configuration en 2 minutes chrono.</p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 text-center text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShoppingBag size={14} />
          <span className="font-bold tracking-widest text-gray-900 dark:text-white uppercase text-xs">Brelness O.S</span>
        </div>
        <p>© {new Date().getFullYear()} propulsé par Brelness. Tous droits réservés.</p>
      </footer>

    </div>
  );
}
