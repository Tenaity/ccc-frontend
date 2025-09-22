import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles.css";
import { UiProvider } from "@/components/ui/UiProvider";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UiProvider>
      <App />
    </UiProvider>
  </React.StrictMode>
);
