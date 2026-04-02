import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Suppress browser-native AbortError from play()/pause() race conditions
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason instanceof DOMException &&
    event.reason.name === "AbortError" &&
    event.reason.message.includes("play")
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);