import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "react-hot-toast";
import PwaInstallBanner from "./components/PwaInstallBanner";

export default function App() {
  return (
    <AppProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#1a2744",
            color: "#E8F0FF",
            border: "1px solid rgba(59,130,246,0.3)",
          },
          success: {
            iconTheme: { primary: "#3B82F6", secondary: "#ffffff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
          },
        }}
      />
      <RouterProvider router={router} />
      <PwaInstallBanner />
    </AppProvider>
  );
}
