import { useState, useEffect, useRef } from "react";
import { Save, Camera, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Globe, Store, XCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import api from "../../api";

export default function ShopProfile() {
  const { currentUser } = useApp();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "", slug: "", description: "", category: "", businessType: "produits",
    address: "", phone: "", email: "",
    facebook: "", instagram: "", twitter: "", tiktok: "",
    heroTitle: "", heroImages: [] as string[],
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "contact" | "social" | "media">("info");

  useEffect(() => {
    const fetchShop = async () => {
      if (!currentUser?.shopId) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/shops/me/shop`);
        setShop(data);
        setForm({
          name: data.name || "", slug: data.slug || "", description: data.description || "", category: data.category || "", businessType: data.businessType || "produits",
          address: data.address || "", phone: data.phone || "", email: data.email || "",
          facebook: data.facebook || "", instagram: data.instagram || "", twitter: data.twitter || "", tiktok: data.tiktok || "",
          heroTitle: data.heroTitle || "", heroImages: data.heroImages || [],
        });
      } catch (err) {
        console.error("Failed to load shop", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [currentUser]);

  const isReadOnly = shop?.license && 
    (shop.license.status === 'GRACE_PERIOD' || shop.license.status === 'EXPIRED') &&
    !shop.isManualOverride;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo'|'banner'|'heroImages', index?: number) => {
    if (isReadOnly) {
      alert("Boutique en mode lecture seule. Action non autorisée.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const upRes = await api.post('/upload', { filename: file.name, data: base64 });
        const newUrl = upRes.data.url;
        
        if (type === 'heroImages') {
          const newHeroImages = [...form.heroImages];
          if (index !== undefined && index < newHeroImages.length) {
            newHeroImages[index] = newUrl;
          } else {
            if (newHeroImages.length < 3) newHeroImages.push(newUrl);
          }
          setForm(f => ({ ...f, heroImages: newHeroImages }));
          await api.patch(`/shops/me/shop`, { heroImages: newHeroImages });
        } else {
          await api.patch(`/shops/me/shop`, { [type]: newUrl });
          setShop((s: any) => ({ ...s, [type]: newUrl }));
        }
      } catch (err) {
        alert("Erreur lors de l'upload de l'image.");
      }
    };
    reader.readAsDataURL(file);
  };


  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    if (!shop?.id) return;
    try {
      setSaving(true);
      setSaveError("");
      await api.patch(`/shops/me/shop`, {
        name: form.name,
        slug: form.slug,
        description: form.description,
        category: form.category,
        businessType: form.businessType,
        address: form.address,
        phone: form.phone,
        email: form.email,
        facebook: form.facebook,
        instagram: form.instagram,
        twitter: form.twitter,
        tiktok: form.tiktok,
        heroTitle: form.heroTitle,
        heroImages: form.heroImages,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setSaveError(Array.isArray(msg) ? msg.join(', ') : (msg || "Erreur lors de la sauvegarde du profil."));
    } finally {
      setSaving(false);
    }
  };

  const CATEGORIES = ["vêtements", "cosmétiques", "électronique", "bijoux", "chaussures", "Autre"];

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="p-12 text-center text-gray-500">Boutique introuvable.</div>
    );
  }
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-gray-900 dark:text-white">Profil de la boutique</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Gérez les informations publiques de {shop.name}</p>
      </div>

      {/* Shop banner preview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <input type="file" accept="image/*" className="hidden" ref={bannerInputRef} onChange={e => handleFileUpload(e, 'banner')} />
        <div className="relative h-36 bg-gray-100 dark:bg-gray-700 group cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
          <img src={shop.banner} alt="Bannière" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Camera size={15} />Changer la bannière
            </button>
          </div>
        </div>
        <div className="px-6 pb-5">
          <div className="flex items-end gap-4 -mt-8">
            <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={e => handleFileUpload(e, 'logo')} />
            <div className="relative group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {shop.logo ? (
                  <img src={shop.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Store size={36} className="text-gray-400" />
                )}
              </div>
              <button className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={16} className="text-white" />
              </button>
            </div>
            <div className="pb-1">
              <h2 className="text-gray-900 dark:text-white">{shop.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{shop.category}</p>
            </div>
            <div className="ml-auto pb-1">
              <a href={`/shop/${shop.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Globe size={13} />Voir la boutique
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation + form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700 px-2 pt-2 gap-1">
          {([
            { id: "info", label: "Informations" },
            { id: "contact", label: "Contact" },
            { id: "social", label: "Réseaux sociaux" },
            { id: "media", label: "Médias" },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors border-b-2 ${activeTab === id ? "text-blue-600 dark:text-blue-400 border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Nom de la boutique</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Sous-domaine (URL)</label>
                  <div className="flex items-center gap-2">
                    <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-0]/g, "-") }))} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <span className="text-sm text-gray-400">.brelness.com</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Titre d'Accueil (Section Héro)</label>
                  <input value={form.heroTitle} onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Le meilleur de nos produits..." />
                </div>
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Catégorie</label>
                  <input list="categories" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ex: Startup, PME, etc..." />
                  <datalist id="categories">
                    {CATEGORIES.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Type d'Entreprise</label>
                <select value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="produits">Vente de Produits</option>
                  <option value="services">Vente de Services</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5 block"><MapPin size={13} />Adresse</label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5 block"><Phone size={13} />Téléphone</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5 block"><Mail size={13} />Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-4">
              {[
                { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/...", color: "text-blue-600" },
                { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/...", color: "text-pink-600" },
                { key: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/...", color: "text-sky-500" },
                { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@...", color: "text-black dark:text-white" },
              ].map(({ key, label, icon: Icon, placeholder, color }) => (
                <div key={key}>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5 block">
                    {Icon && <Icon size={13} className={color} />}
                    {!Icon && <span className={`text-xs font-bold ${color}`}>TK</span>}
                    {label}
                  </label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Logo de la boutique</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {shop.logo ? (
                      <img src={shop.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Store size={36} className="text-gray-400" />
                    )}
                  </div>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 flex-1 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={() => logoInputRef.current?.click()}>
                    <Camera size={20} className="text-gray-300 dark:text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cliquez pour ajouter votre logo</p>
                    <p className="text-xs text-gray-300 dark:text-gray-500">PNG, JPG · max 5MB · recommandé 400×400px</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Bannière</label>
                <div onClick={() => bannerInputRef.current?.click()} className="relative cursor-pointer h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-600">
                  <img src={shop.banner} alt="Bannière" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm text-gray-700 transition-colors pointer-events-none">
                      <Camera size={15} />Changer la bannière
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Recommandé : 1200×400px</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300 block">Images du slider d'accueil (Max 3)</label>
                  {form.heroImages.length < 3 && (
                    <label className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline flex items-center gap-1">
                      <Camera size={13} />
                      Ajouter
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'heroImages')} />
                    </label>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="relative h-24 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                      {form.heroImages[i] ? (
                        <>
                          <img src={form.heroImages[i]} alt="Hero slide" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <label className="p-2 bg-white rounded-lg text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
                              <Camera size={15} />
                              <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'heroImages', i)} />
                            </label>
                            <button onClick={(e) => {
                              e.preventDefault();
                              const newImgs = [...form.heroImages];
                              newImgs.splice(i, 1);
                              setForm(f => ({ ...f, heroImages: newImgs }));
                            }} className="p-2 ml-2 bg-red-50 text-red-600 rounded-lg cursor-pointer hover:bg-red-100 transition-colors shadow-sm">
                              <XCircle size={15} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Vide</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">Images qui défilent en arrière-plan. Recommandé : 1920×1080px</p>
              </div>
            </div>
          )}
        </div>

        {/* Save */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          {saved && <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><Save size={14} />Modifications enregistrées !</p>}
          {saveError && <p className="text-sm text-red-500 flex-1 mr-4">{saveError}</p>}
          <button onClick={handleSave} disabled={saving || isReadOnly} className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Save size={15} />}
            <span>{saving ? "Enregistrement..." : "Enregistrer les modifications"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
