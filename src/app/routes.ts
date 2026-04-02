import { createBrowserRouter, redirect } from "react-router";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import ShopAdminLayout from "./layouts/ShopAdminLayout";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import SADashboard from "./pages/superadmin/Dashboard";
import SAShops from "./pages/superadmin/Shops";
import SAAdmins from "./pages/superadmin/Admins";
import SALicenses from "./pages/superadmin/Licenses";
import SANotifications from "./pages/superadmin/Notifications";
import SASettings from "./pages/superadmin/Settings";
import ShopDashboard from "./pages/shopadmin/Dashboard";
import ShopProducts from "./pages/shopadmin/Products";
import ShopReservations from "./pages/shopadmin/Reservations";
import ShopAnalytics from "./pages/shopadmin/Analytics";
import ShopReviews from "./pages/shopadmin/Reviews";
import ShopClients from "./pages/shopadmin/Clients";
import ShopProfile from "./pages/shopadmin/Profile";
import ShopSubscription from "./pages/shopadmin/Subscription";
import ShopSupport from "./pages/shopadmin/Support";
import ShopDiscounts from "./pages/shopadmin/Discounts";
import SATickets from "./pages/superadmin/Tickets";
import ShopCatalog from "./pages/public/ShopCatalog";
import ProductPage from "./pages/public/ProductPage";
import { getSubdomain } from "./utils/subdomain";

function getUser() {
  const saved = localStorage.getItem("brelness_user");
  return saved ? JSON.parse(saved) : null;
}

const subdomain = getSubdomain();

// Subdomain-specific routes (Storefront)
const subdomainRoutes = [
  {
    path: "/",
    Component: ShopCatalog,
    loader: () => {
      // Pass the detected subdomain as the shopSlug to ShopCatalog
      // This is handled by reading the subdomain in the component, 
      // but we can also use dynamic params if we wrap it.
      return null;
    }
  },
  {
    path: "/product/:shareCode",
    Component: ProductPage,
  },
  {
    path: "*",
    Component: ShopCatalog, // Fallback to catalog or 404
  }
];

// Base platform routes
const baseRoutes = [
  {
    path: "/",
    loader: () => {
      const user = getUser();
      if (user?.role === "superadmin") return redirect("/superadmin");
      if (user?.role === "admin") return redirect("/admin");
      const welcomed = localStorage.getItem("brelness_welcomed");
      if (!welcomed) return redirect("/welcome");
      return redirect("/login");
    },
    Component: () => null,
  },
  {
    path: "/welcome",
    Component: Welcome,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/superadmin",
    Component: SuperAdminLayout,
    loader: () => {
      const user = getUser();
      if (!user || user.role !== "superadmin") return redirect("/login");
      return null;
    },
    children: [
      { index: true, Component: SADashboard },
      { path: "shops", Component: SAShops },
      { path: "admins", Component: SAAdmins },
      { path: "licenses", Component: SALicenses },
      { path: "notifications", Component: SANotifications },
      { path: "settings", Component: SASettings },
      { path: "tickets", Component: SATickets },
    ],
  },
  {
    path: "/admin",
    Component: ShopAdminLayout,
    loader: () => {
      const user = getUser();
      if (!user || user.role !== "admin") return redirect("/login");
      return null;
    },
    children: [
      { index: true, Component: ShopDashboard },
      { path: "products", Component: ShopProducts },
      { path: "reservations", Component: ShopReservations },
      { path: "clients", Component: ShopClients },
      { path: "analytics", Component: ShopAnalytics },
      { path: "reviews", Component: ShopReviews },
      { path: "discounts", Component: ShopDiscounts },
      { path: "profile", Component: ShopProfile },
      { path: "subscription", Component: ShopSubscription },
      { path: "support", Component: ShopSupport },
    ],
  },
  {
    path: "/shop/:shopSlug",
    Component: ShopCatalog,
  },
  {
    path: "/product/:shareCode",
    Component: ProductPage,
  },
];

export const router = createBrowserRouter(subdomain ? subdomainRoutes : baseRoutes);
