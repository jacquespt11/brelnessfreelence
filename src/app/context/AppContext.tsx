import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "superadmin" | "admin";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  shopId?: string;
  shopName?: string;
  avatar?: string;
  token?: string;
}

interface AppContextType {
  currentUser: CurrentUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isDark: boolean;
  toggleDark: () => void;
  notificationCount: number;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
  checkAuth: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

import api from '../api';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem("brelness_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isDark, setIsDark] = useState(() => localStorage.getItem("brelness_theme") === "dark");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("brelness_theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    if (!currentUser?.token) return;
    const fetchNotifs = async () => {
      try {
        const { data } = await api.get('/notifications');
        const unread = data.filter((n: any) => !n.isRead).length;
        setNotificationCount(unread);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Verify if the role requested matches the user's role in DB
      const { access_token, user } = response.data;
      
      // Convert db roles to frontend standard
      const backendRole = user.role === 'SUPER_ADMIN' ? 'superadmin' : 'admin';
      
      if (backendRole !== role) {
        console.error("Le rôle souhaité ne correspond pas au rôle réel de l'utilisateur.");
        return false;
      }
      
      const loggedInUser: CurrentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: backendRole,
        shopId: user.shopId,
        token: access_token, // Persist token for interceptors
      };
      
      // Optional: if shopId is set, fetch the shop name maybe ? Or the backend will soon return it
      if (user.shop && user.shop.name) {
          loggedInUser.shopName = user.shop.name;
      }

      setCurrentUser(loggedInUser);
      localStorage.setItem("brelness_user", JSON.stringify(loggedInUser));
      return true;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("brelness_user");
  };

  const toggleDark = () => setIsDark(d => !d);

  const checkAuth = async () => {
    if (!currentUser?.token) return;
    try {
      const res = await api.get('/auth/me');
      const updatedUser = {
        ...currentUser,
        name: res.data.name,
        email: res.data.email,
        avatar: res.data.avatar,
        // Preserve role and token
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("brelness_user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to refresh user profile", err);
    }
  };

  return (
    <AppContext.Provider value={{ currentUser, login, logout, isDark, toggleDark, notificationCount, setNotificationCount, checkAuth }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}