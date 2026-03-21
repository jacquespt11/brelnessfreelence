export type ShopCategory = "vêtements" | "cosmétiques" | "électronique" | "bijoux" | "chaussures";
export type LicenseType = "Basic" | "Professional" | "Enterprise";
export type LicenseStatus = "Actif" | "Expiré" | "Annulé";
export type ShopStatus = "active" | "inactive";
export type ReservationStatus = "En attente" | "Confirmée" | "Complétée" | "Annulée";

export interface Shop {
  id: string;
  name: string;
  slug: string;
  category: ShopCategory;
  description: string;
  logo: string;
  banner: string;
  adminId: string;
  adminName: string;
  status: ShopStatus;
  address: string;
  phone: string;
  email: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  license: {
    type: LicenseType;
    status: LicenseStatus;
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  totalReservations: number;
  totalProducts: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  shopId: string;
  shopName: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  shopId: string;
  shareCode: string;
  status: "active" | "inactive";
  tags: string[];
  rating: number;
  reviewCount: number;
  reservationCount: number;
  createdAt: string;
}

export interface Reservation {
  id: string;
  productId: string;
  productName: string;
  shopId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  quantity: number;
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  shopId: string;
  customerName: string;
  rating: number;
  comment: string;
  isModerated: boolean;
  helpful: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "reservation" | "license" | "system" | "shop";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  targetRole: "superadmin" | "admin" | "all";
}

// ── SHOPS ──────────────────────────────────────────────────────────────────
export const shops: Shop[] = [
  {
    id: "shop-1",
    name: "Élégance Mode",
    slug: "elegance-mode",
    category: "vêtements",
    description: "Boutique de mode féminine haut de gamme avec les dernières tendances parisiennes.",
    logo: "https://images.unsplash.com/photo-1769107805412-90d9191d53e9?w=400&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1769107805412-90d9191d53e9?w=1200&h=400&fit=crop",
    adminId: "admin-1",
    adminName: "Sophie Martin",
    status: "active",
    address: "12 Rue de la Mode, Abidjan",
    phone: "+225 07 01 02 03",
    email: "contact@elegance-mode.ci",
    facebook: "https://facebook.com/elegancemode",
    instagram: "https://instagram.com/elegancemode",
    tiktok: "https://tiktok.com/@elegancemode",
    license: { type: "Professional", status: "Actif", startDate: "2024-01-01", endDate: "2026-01-01" },
    createdAt: "2024-01-15",
    totalReservations: 247,
    totalProducts: 42,
  },
  {
    id: "shop-2",
    name: "Beauty Lab",
    slug: "beauty-lab",
    category: "cosmétiques",
    description: "Cosmétiques premium et soins de beauté naturels pour sublimer votre peau.",
    logo: "https://images.unsplash.com/photo-1757800945942-cdc006f6f5eb?w=400&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1757800945942-cdc006f6f5eb?w=1200&h=400&fit=crop",
    adminId: "admin-2",
    adminName: "Amina Koné",
    status: "active",
    address: "8 Boulevard de la Beauté, Dakar",
    phone: "+221 77 11 22 33",
    email: "hello@beautylab.sn",
    instagram: "https://instagram.com/beautylab",
    facebook: "https://facebook.com/beautylab",
    license: { type: "Enterprise", status: "Actif", startDate: "2024-03-01", endDate: "2025-04-15" },
    createdAt: "2024-03-10",
    totalReservations: 189,
    totalProducts: 31,
  },
  {
    id: "shop-3",
    name: "TechZone",
    slug: "tech-zone",
    category: "électronique",
    description: "Dernières innovations en électronique, smartphones, accessoires et plus.",
    logo: "https://images.unsplash.com/photo-1740803292814-13d2e35924c3?w=400&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1740803292814-13d2e35924c3?w=1200&h=400&fit=crop",
    adminId: "admin-3",
    adminName: "Kwame Asante",
    status: "active",
    address: "5 Tech Avenue, Accra",
    phone: "+233 24 555 6789",
    email: "info@techzone.gh",
    facebook: "https://facebook.com/techzone",
    twitter: "https://twitter.com/techzone",
    license: { type: "Basic", status: "Expiré", startDate: "2023-06-01", endDate: "2025-03-10" },
    createdAt: "2023-06-15",
    totalReservations: 312,
    totalProducts: 58,
  },
  {
    id: "shop-4",
    name: "Bijoux Dorés",
    slug: "bijoux-dores",
    category: "bijoux",
    description: "Bijoux artisanaux plaqués or, argent et pierres précieuses pour toutes occasions.",
    logo: "https://images.unsplash.com/photo-1764512680324-048f158cab2b?w=400&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1764512680324-048f158cab2b?w=1200&h=400&fit=crop",
    adminId: "admin-4",
    adminName: "Fatou Diallo",
    status: "inactive",
    address: "22 Rue des Artisans, Bamako",
    phone: "+223 70 12 34 56",
    email: "info@bijouxdores.ml",
    instagram: "https://instagram.com/bijouxdores",
    tiktok: "https://tiktok.com/@bijouxdores",
    license: { type: "Professional", status: "Annulé", startDate: "2023-09-01", endDate: "2024-09-01" },
    createdAt: "2023-09-20",
    totalReservations: 78,
    totalProducts: 15,
  },
  {
    id: "shop-5",
    name: "Foot Style",
    slug: "foot-style",
    category: "chaussures",
    description: "Chaussures tendance pour hommes et femmes. Qualité et confort au meilleur prix.",
    logo: "https://images.unsplash.com/photo-1753161021111-e039185c0208?w=400&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1753161021111-e039185c0208?w=1200&h=400&fit=crop",
    adminId: "admin-5",
    adminName: "Moussa Traoré",
    status: "active",
    address: "18 Avenue du Commerce, Abidjan",
    phone: "+225 05 55 66 77",
    email: "contact@footstyle.ci",
    facebook: "https://facebook.com/footstyle",
    instagram: "https://instagram.com/footstyle",
    license: { type: "Professional", status: "Actif", startDate: "2024-07-01", endDate: "2026-04-01" },
    createdAt: "2024-07-05",
    totalReservations: 156,
    totalProducts: 28,
  },
];

// ── ADMINS ─────────────────────────────────────────────────────────────────
export const admins: Admin[] = [
  { id: "admin-1", name: "Sophie Martin", email: "sophie@elegance-mode.ci", shopId: "shop-1", shopName: "Élégance Mode", status: "active", createdAt: "2024-01-15", lastLogin: "2026-03-17" },
  { id: "admin-2", name: "Amina Koné", email: "amina@beautylab.sn", shopId: "shop-2", shopName: "Beauty Lab", status: "active", createdAt: "2024-03-10", lastLogin: "2026-03-18" },
  { id: "admin-3", name: "Kwame Asante", email: "kwame@techzone.gh", shopId: "shop-3", shopName: "TechZone", status: "inactive", createdAt: "2023-06-15", lastLogin: "2026-02-28" },
  { id: "admin-4", name: "Fatou Diallo", email: "fatou@bijouxdores.ml", shopId: "shop-4", shopName: "Bijoux Dorés", status: "inactive", createdAt: "2023-09-20", lastLogin: "2025-09-10" },
  { id: "admin-5", name: "Moussa Traoré", email: "moussa@footstyle.ci", shopId: "shop-5", shopName: "Foot Style", status: "active", createdAt: "2024-07-05", lastLogin: "2026-03-16" },
];

// ── PRODUCTS ───────────────────────────────────────────────────────────────
export const products: Product[] = [
  {
    id: "prod-1", name: "Robe d'Été Fleurie", slug: "robe-ete-fleurie",
    description: "Magnifique robe légère à motifs floraux, idéale pour l'été. Disponible en plusieurs tailles.",
    price: 24500, category: "Robes",
    images: ["https://images.unsplash.com/photo-1773335954232-957e8945827e?w=600&h=600&fit=crop"],
    stock: 12, shopId: "shop-1", shareCode: "ELG-001", status: "active",
    tags: ["robe", "été", "floral"], rating: 4.5, reviewCount: 18, reservationCount: 34, createdAt: "2025-01-10",
  },
  {
    id: "prod-2", name: "Blazer Classique Noir", slug: "blazer-classique-noir",
    description: "Blazer intemporel pour toutes occasions professionnelles et casual chic.",
    price: 38000, category: "Vestes",
    images: ["https://images.unsplash.com/photo-1769107805412-90d9191d53e9?w=600&h=600&fit=crop"],
    stock: 8, shopId: "shop-1", shareCode: "ELG-002", status: "active",
    tags: ["blazer", "noir", "professionnel"], rating: 4.8, reviewCount: 12, reservationCount: 22, createdAt: "2025-02-05",
  },
  {
    id: "prod-3", name: "Sérum Éclat Visage", slug: "serum-eclat-visage",
    description: "Sérum ultra-concentré à la vitamine C pour un teint lumineux et unifié en 7 jours.",
    price: 18900, category: "Soins Visage",
    images: ["https://images.unsplash.com/photo-1739950839930-ef45c078f316?w=600&h=600&fit=crop"],
    stock: 25, shopId: "shop-2", shareCode: "BL-001", status: "active",
    tags: ["sérum", "vitamine C", "éclat"], rating: 4.9, reviewCount: 45, reservationCount: 67, createdAt: "2024-11-20",
  },
  {
    id: "prod-4", name: "Crème Hydratante Karité", slug: "creme-hydratante-karite",
    description: "Crème riche au beurre de karité pur pour une hydratation intense de la peau.",
    price: 12500, category: "Soins Corps",
    images: ["https://images.unsplash.com/photo-1757800945942-cdc006f6f5eb?w=600&h=600&fit=crop"],
    stock: 40, shopId: "shop-2", shareCode: "BL-002", status: "active",
    tags: ["crème", "karité", "hydratant"], rating: 4.7, reviewCount: 32, reservationCount: 51, createdAt: "2024-12-01",
  },
  {
    id: "prod-5", name: "Casque Bluetooth Pro", slug: "casque-bluetooth-pro",
    description: "Casque sans fil avec réduction de bruit active, autonomie 40h et son cristallin.",
    price: 85000, category: "Audio",
    images: ["https://images.unsplash.com/photo-1578517581165-61ec5ab27a19?w=600&h=600&fit=crop"],
    stock: 5, shopId: "shop-3", shareCode: "TZ-001", status: "active",
    tags: ["casque", "bluetooth", "audio"], rating: 4.6, reviewCount: 28, reservationCount: 89, createdAt: "2024-08-15",
  },
  {
    id: "prod-6", name: "Collier Or 18K", slug: "collier-or-18k",
    description: "Magnifique collier plaqué or 18 carats avec pendentif en forme de fleur.",
    price: 55000, category: "Colliers",
    images: ["https://images.unsplash.com/photo-1758995115560-59c10d6cc28f?w=600&h=600&fit=crop"],
    stock: 3, shopId: "shop-4", shareCode: "BD-001", status: "active",
    tags: ["collier", "or", "bijou"], rating: 4.8, reviewCount: 9, reservationCount: 15, createdAt: "2024-10-05",
  },
  {
    id: "prod-7", name: "Sneakers Blanches Urban", slug: "sneakers-blanches-urban",
    description: "Sneakers tendance en cuir vegan blanc, semelle épaisse, confort absolu.",
    price: 42000, category: "Sneakers",
    images: ["https://images.unsplash.com/photo-1718802312915-4e03a6f33735?w=600&h=600&fit=crop"],
    stock: 18, shopId: "shop-5", shareCode: "FS-001", status: "active",
    tags: ["sneakers", "blanc", "urban"], rating: 4.4, reviewCount: 22, reservationCount: 45, createdAt: "2025-01-20",
  },
];

// ── RESERVATIONS ───────────────────────────────────────────────────────────
export const reservations: Reservation[] = [
  { id: "res-1", productId: "prod-1", productName: "Robe d'Été Fleurie", shopId: "shop-1", customerName: "Karine Dupont", customerPhone: "+225 07 55 44 33", customerEmail: "karine@email.com", quantity: 1, status: "En attente", createdAt: "2026-03-17T10:30:00", updatedAt: "2026-03-17T10:30:00" },
  { id: "res-2", productId: "prod-2", productName: "Blazer Classique Noir", shopId: "shop-1", customerName: "Djamila Sy", customerPhone: "+225 05 12 34 56", quantity: 1, status: "Confirmée", createdAt: "2026-03-16T14:20:00", updatedAt: "2026-03-16T16:00:00" },
  { id: "res-3", productId: "prod-1", productName: "Robe d'Été Fleurie", shopId: "shop-1", customerName: "Marie Kohou", customerPhone: "+225 01 23 45 67", quantity: 2, status: "Complétée", createdAt: "2026-03-15T09:10:00", updatedAt: "2026-03-15T11:00:00" },
  { id: "res-4", productId: "prod-3", productName: "Sérum Éclat Visage", shopId: "shop-2", customerName: "Aïssatou Ba", customerPhone: "+221 76 33 22 11", customerEmail: "aissatou@email.com", quantity: 2, status: "En attente", createdAt: "2026-03-18T08:00:00", updatedAt: "2026-03-18T08:00:00" },
  { id: "res-5", productId: "prod-4", productName: "Crème Hydratante Karité", shopId: "shop-2", customerName: "Ndéye Fall", customerPhone: "+221 77 44 55 66", quantity: 3, status: "Confirmée", createdAt: "2026-03-17T11:30:00", updatedAt: "2026-03-17T13:00:00" },
  { id: "res-6", productId: "prod-5", productName: "Casque Bluetooth Pro", shopId: "shop-3", customerName: "Kofi Mensah", customerPhone: "+233 20 11 22 33", quantity: 1, status: "Annulée", notes: "Hors stock", createdAt: "2026-03-14T16:00:00", updatedAt: "2026-03-15T10:00:00" },
  { id: "res-7", productId: "prod-7", productName: "Sneakers Blanches Urban", shopId: "shop-5", customerName: "Ibrahim Coulibaly", customerPhone: "+225 07 88 99 00", quantity: 1, status: "En attente", createdAt: "2026-03-18T07:45:00", updatedAt: "2026-03-18T07:45:00" },
  { id: "res-8", productId: "prod-7", productName: "Sneakers Blanches Urban", shopId: "shop-5", customerName: "Sandrine Yao", customerPhone: "+225 05 66 77 88", customerEmail: "sandrine@email.com", quantity: 1, status: "Confirmée", createdAt: "2026-03-16T12:00:00", updatedAt: "2026-03-16T14:30:00" },
];

// ── REVIEWS ────────────────────────────────────────────────────────────────
export const reviews: Review[] = [
  { id: "rev-1", productId: "prod-1", productName: "Robe d'Été Fleurie", shopId: "shop-1", customerName: "Karine D.", rating: 5, comment: "Absolument magnifique ! La qualité est au rendez-vous et le tissu est très agréable.", isModerated: true, helpful: 12, createdAt: "2026-03-10" },
  { id: "rev-2", productId: "prod-1", productName: "Robe d'Été Fleurie", shopId: "shop-1", customerName: "Laure M.", rating: 4, comment: "Très belle robe, conforme aux photos. Livraison rapide.", isModerated: true, helpful: 7, createdAt: "2026-03-08" },
  { id: "rev-3", productId: "prod-2", productName: "Blazer Classique Noir", shopId: "shop-1", customerName: "Patricia N.", rating: 5, comment: "Parfait pour le bureau. Coupe impeccable.", isModerated: false, helpful: 0, createdAt: "2026-03-15" },
  { id: "rev-4", productId: "prod-3", productName: "Sérum Éclat Visage", shopId: "shop-2", customerName: "Aïcha K.", rating: 5, comment: "Résultats visibles dès la première semaine ! Mon teint est vraiment plus lumineux.", isModerated: true, helpful: 25, createdAt: "2026-03-01" },
  { id: "rev-5", productId: "prod-4", productName: "Crème Hydratante Karité", shopId: "shop-2", customerName: "Mariam S.", rating: 4, comment: "Bonne crème, texture agréable. Un peu chère mais efficace.", isModerated: true, helpful: 8, createdAt: "2026-02-20" },
  { id: "rev-6", productId: "prod-7", productName: "Sneakers Blanches Urban", shopId: "shop-5", customerName: "Anonyme", rating: 3, comment: "Bien mais un peu petites à la pointure. Prendre une taille au-dessus.", isModerated: false, helpful: 3, createdAt: "2026-03-12" },
];

// ── NOTIFICATIONS ──────────────────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: "notif-1", type: "reservation", title: "Nouvelle réservation", message: "Karine Dupont a réservé la Robe d'Été Fleurie", isRead: false, createdAt: "2026-03-17T10:30:00", targetRole: "all" },
  { id: "notif-2", type: "license", title: "Licence expirée", message: "La licence de TechZone a expiré le 10 mars 2026", isRead: false, createdAt: "2026-03-10T00:00:00", targetRole: "superadmin" },
  { id: "notif-3", type: "license", title: "Licence bientôt expirée", message: "La licence de Beauty Lab expire dans 28 jours", isRead: true, createdAt: "2026-03-18T09:00:00", targetRole: "superadmin" },
  { id: "notif-4", type: "shop", title: "Nouvelle boutique créée", message: "La boutique Foot Style vient d'être activée", isRead: true, createdAt: "2026-03-05T14:00:00", targetRole: "superadmin" },
  { id: "notif-5", type: "reservation", title: "Réservation confirmée", message: "Votre réservation du Blazer Classique a été confirmée", isRead: true, createdAt: "2026-03-16T16:00:00", targetRole: "admin" },
  { id: "notif-6", type: "system", title: "Mise à jour système", message: "Brelness v2.1.0 est maintenant disponible avec de nouvelles fonctionnalités.", isRead: false, createdAt: "2026-03-15T08:00:00", targetRole: "all" },
  { id: "notif-7", type: "reservation", title: "Stock faible", message: "Le produit 'Collier Or 18K' n'a plus que 3 unités en stock", isRead: false, createdAt: "2026-03-18T06:00:00", targetRole: "admin" },
];

// ── ANALYTICS DATA ─────────────────────────────────────────────────────────
export const reservationTrend = [
  { month: "Sep", reservations: 42, shops: 3 },
  { month: "Oct", reservations: 68, shops: 4 },
  { month: "Nov", reservations: 91, shops: 4 },
  { month: "Déc", reservations: 115, shops: 5 },
  { month: "Jan", reservations: 98, shops: 5 },
  { month: "Fév", reservations: 134, shops: 5 },
  { month: "Mar", reservations: 178, shops: 5 },
];

export const shopReservationData = shops.map(s => ({
  name: s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name,
  reservations: s.totalReservations,
}));

export const categoryData = [
  { name: "Vêtements", value: 32, color: "#6366f1" },
  { name: "Cosmétiques", value: 28, color: "#f59e0b" },
  { name: "Électronique", value: 20, color: "#10b981" },
  { name: "Chaussures", value: 12, color: "#3b82f6" },
  { name: "Bijoux", value: 8, color: "#ec4899" },
];

export const productReservationTrend = [
  { day: "Lun", reservations: 8 },
  { day: "Mar", reservations: 12 },
  { day: "Mer", reservations: 7 },
  { day: "Jeu", reservations: 15 },
  { day: "Ven", reservations: 20 },
  { day: "Sam", reservations: 25 },
  { day: "Dim", reservations: 18 },
];
